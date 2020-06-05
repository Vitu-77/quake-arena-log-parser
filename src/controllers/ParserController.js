const Parser = require('../helpers/Parser');

module.exports = {
	index: async (req, res) => {
		try {
			const games = await Parser.parse();

			return res.status(200).json({
				games,
			});
		} catch (error) {
			return res.status(error.status || 500).json(...error);
		}
	},

	show: async (req, res) => {},
};
