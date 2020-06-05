const fs = require('fs');
const path = require('path');

const shortid = require('shortid');
const readLine = require('readline');

module.exports = {
	readFile: async () => {
		const log = await fs.readFileSync(
			path.resolve(__dirname, '..', 'log', 'quake.log'),
			'ascii',
			(error, data) => {
				if (error) throw error;
			}
		);

		return log.toString();
	},

	groupByGames: async (log) => {
		try {
			const fileStream = fs.createReadStream(path.resolve(__dirname, '..', 'log', 'quake.log'));

			const _readline = readLine.createInterface({
				input: fileStream,
			});

			const games = [];

			/**
			 * A função getLinePlayers processa a linha e retorna todos os
			 * jogadores presentes nela, bem como as kills de cada um
			 */
			const getLinePlayers = (line) => {
				const lineArray = line.split(' ');
				const currentGame = games[games.length - 1];

				lineArray.forEach((currentPosition, index) => {
					if (currentPosition === 'killed') {
						if (lineArray[index - 1] !== '<world>') {
							const murderer = lineArray[index - 1];

							if (!currentGame.players.includes(murderer)) {
								currentGame.players.push(murderer);
							}
						}

						if (!currentGame.players.includes(lineArray[index + 1])) {
							const murdered = lineArray[index + 1];
							currentGame.players.push(murdered);
						}
					}
				});
			};

			const buildGame = async (line) => {
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
					getLinePlayers(line);
				}
			};

			for await (const line of _readline) {
				buildGame(line);
			}

			// for await (const line of readline) {
			// 	if (line.includes('InitGame')) {
			//         console.log(line)
			// 		g++;
			// 	}
			// 	if (line.includes('Kill:')) {
			// 		k++;
			// 	}
			// }

			return { games };
		} catch (error) {
			return error;
		}
	},
};
