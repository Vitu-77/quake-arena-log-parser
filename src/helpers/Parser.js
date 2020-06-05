const fs = require('fs');
const path = require('path');

const shortid = require('shortid');
const readLine = require('readline');

module.exports = {
	parse: async () => {
		try {
			const fileStream = fs.createReadStream(path.resolve(__dirname, '..', 'log', 'quake.log'));

			const _readline = readLine.createInterface({
				input: fileStream,
			});

			const games = [];

			/**
			 * A função parseLineWithKill processa a linha e retorna todos os
			 * jogadores presentes nela, bem como as kills de cada um.
			 */
			const parseLineWithKill = (line) => {
				const lineArray = line.split(' '); // converte a linha para array
				const currentGame = games[games.length - 1]; // o game atual sempre será a última posição do array.

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
								currentGame.players.push(killer);
							}

							if (currentGame.kills.hasOwnProperty(killer)) {
								currentGame.kills[killer] = currentGame.kills[killer] + 1;
							} else {
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
				const id = shortid.generate();
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

			for await (const line of _readline) {
				processLine(line);
			}

			return games;
		} catch (error) {
			return error;
		}
	},
};
