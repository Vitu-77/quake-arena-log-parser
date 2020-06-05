const fs = require('fs');
const path = require('path');

const Parser = require('../helpers/Parser');

module.exports = {
	index: async (req, res) => {
		try {
			const logStream = fs.createReadStream(path.resolve(__dirname, '..', 'log', 'quake.log'));
			const games = await Parser.parse(logStream);

			return res.status(200).json({
				games,
			});
		} catch (error) {
			return res.status(error.status || 500).json(...error);
		}
	},

	show: async (req, res) => {},
};
