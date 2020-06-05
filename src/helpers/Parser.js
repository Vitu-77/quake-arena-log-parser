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
			 * sanitizeGamesArray retira do array possíveis jogos sem jogadores
			 */
			const sanitizeGamesArray = (games) => {
				return games.filter((game) => game.players.length >= 1);
			};

			for await (const line of _readline) {
				processLine(line);
			}

			return sanitizeGamesArray(games);
		} catch (error) {
			return error;
		}
	},

	ranking: (games) => {
		let ranking = {};

		games.forEach((game) => {
			for (const player in game.kills) {
				if (game.kills.hasOwnProperty(player)) {
					const killer = player;
					const points = game.kills[killer];

					if (!ranking[killer]) {
						ranking[killer] = points;
					} else {
						ranking[killer] += points;
					}
				}
			}
		});

		const toArray = (rankingObject) => {
			const keys = Object.keys(rankingObject);
			const rankingArray = keys.map((key) => {
				return { [key]: rankingObject[key] };
			});

			return rankingArray;
		};

		ranking = toArray(ranking).sort((a, b) => (a.points > b.points ? 1 : -1));

		Object.assign(ranking, ranking);

		return ranking;

		// return toArray(ranking);
	},
};
