const readLine = require('readline');

module.exports = {
	parse: async (logStream) => {
		try {
			const _readline = readLine.createInterface({ input: logStream });
			const games = []; // array que armazena todos os jogos do log

			/**
			 * A função parseLineWithKill processa a linha e retorna todos os
			 * jogadores presentes nela, bem como as kills de cada um.
			 */
			const parseLineWithKill = (line) => {
				const lineArray = line.split(' ');
				const currentGame = games[games.length - 1];

				/**
				 * a ideia aqui é percorrer o array com as palavras da linha e
				 * buscar pela palavra "killed", já que ela determina quem matou e quem morreu.
				 */
				lineArray.forEach((currentWord, index) => {
					if (currentWord === 'killed') {
						const killer = lineArray[index - 1];
						const murdered = lineArray[index + 1];

						if (killer === murdered) return; // nada ocorre caso o player tenha se matado.

						if (killer !== '<world>') {
							if (!currentGame.players.includes(killer)) {
								// caso o killer não esteja no array de player, ele é adicionado
								currentGame.players.push(killer);
							}

							if (currentGame.kills.hasOwnProperty(killer)) {
								// caso o obj de kills possua o killer, ele recebe +1 ponto
								currentGame.kills[killer] = currentGame.kills[killer] + 1;
							} else {
								// senão é inserido com 1 ponto.
								currentGame.kills[killer] = 1;
							}
						} else {
							if (currentGame.kills.hasOwnProperty(murdered)) {
								currentGame.kills[murdered] = currentGame.kills[murdered] - 1;
							} else {
								currentGame.kills[murdered] = -1;
							}
						}

						if (!currentGame.players.includes(murdered)) {
							currentGame.players.push(murdered);
						}
					}
				});


				/**
				 * a rotina a seguir percorre o array de player e busca por 
				 * possíveis jogadores sem pontuação, em seguida insere 
				 * os mesmos na pontuação com 0 pontos;
				 */
				currentGame.players.forEach((player) => {
					if (!currentGame.kills.hasOwnProperty(player)) {
						currentGame.kills[player] = 0;
					}
				});
			};

			/**
			 * processLine verifica se a linha passada como parâmetro
			 * determina o início de um novo game ou uma kill.
			 */
			const processLine = async (line) => {
				let totalKills = 0;
				const id = games.length + 1;
				const players = [];
				const kills = {};

				if (line.includes('InitGame')) {
					games.push({
						id,
						players,
						kills,
						total_kills: totalKills,
					});
				}

				if (line.includes('Kill:')) {
					games[games.length - 1].total_kills = games[games.length - 1].total_kills + 1;
					parseLineWithKill(line);
				}
			};

			/**
			 * removeInvalidGames retira do array possíveis jogos sem jogadores
			 */
			const removeInvalidGames = (games) => {
				return games.filter((game) => game.players.length >= 1);
			};

			for await (const line of _readline) {
				processLine(line);
			}

			return removeInvalidGames(games);
		} catch (error) {
			return error;
		}
	},
};
