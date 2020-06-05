const Parser = require('../helpers/Parser');

module.exports = {
	index: async (req, res) => {
		try {
			const log = await Parser.readFile();
			const games = await Parser.groupByGames(log);
// console.log(games)
			return res.status(200).json({
				// log: log.toString(),
                sucess: 'OK',
                games
			});
		} catch (error) {
			// console.log(error);
			return res.status(error.status || 500).json(...error);
		}
	},

	show: async (req, res) => {},
};
