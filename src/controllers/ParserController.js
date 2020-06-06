const fs = require('fs');
const path = require('path');

const Parser = require('../helpers/Parser');

module.exports = {
	index: async (req, res) => {
		try {
			const logStream = fs.createReadStream(path.resolve(__dirname, '..', 'log', 'quake.log'));
			const games = await Parser.parse(logStream);

			return res.status(200).json({ games });
		} catch (error) {
			return res.status(error.status || 500).json(...error);
		}
	},

	show: async (req, res) => {
		try {
			const { id } = req.params;

			if (isNaN(Number(id))) {
				// uma exceção é gerada caso o ID fornecido não seja um número
				throw { status: 400, message: 'id should be a number' };
			}

			const logStream = fs.createReadStream(path.resolve(__dirname, '..', 'log', 'quake.log'));
			const games = await Parser.parse(logStream);

			// filtra o jogo pelo ID
			const game = games.filter((game) => Number(game.id) === Number(id))[0];

			if (game) {
				return res.status(200).json({ game });
			} else {
				throw { status: 404, message: 'game not found' };
			}
		} catch (error) {
			return res.status(error.status || 500).json({ error: error.message });
		}
	},
};
