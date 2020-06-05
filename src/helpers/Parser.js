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

			const buildGame = async (line) => {
				let kills = 0;
				const id = shortid.generate();
				const players = [];

				if (line.includes('InitGame')) {
					games.push({
						id,
						players,
						total_kills: kills,
					});
				}

				if (line.includes('Kill:')) {
					games[games.length - 1].total_kills = games[games.length - 1].total_kills + 1;
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
