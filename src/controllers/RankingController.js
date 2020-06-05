const fs = require('fs');
const path = require('path');

const Parser = require('../helpers/Parser');

module.exports = {
	index: async (req, res) => {
		try {
			const logStream = fs.createReadStream(path.resolve(__dirname, '..', 'log', 'quake.log'));
			const games = await Parser.parse(logStream);

			const ranking = {};

			/**
			 * o bloco de código a seguir percorre todo o array de jogos
			 * e atribui a cada jogador sua devida pontuação
			 */
			games.forEach((game) => {
				for (const player in game.kills) {
					if (game.kills.hasOwnProperty(player)) {
						const killer = player;
						const points = game.kills[killer];

						if (!ranking[killer]) {
							// caso o player ainda não esteja no ranking, ele é adicionado
							ranking[killer] = points;
						} else {
							// senão, sua pontuação é atualizada
							ranking[killer] += points;
						}
					}
				}
			});

			return res.status(200).json({ ranking });
		} catch (error) {
			return res.status(error.status || 500).json(...error);
		}
	},
};
