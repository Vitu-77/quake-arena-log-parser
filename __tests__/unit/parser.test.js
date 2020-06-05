const fs = require('fs');
const Parser = require('../../src/helpers/Parser');

describe('Parser', () => {
	it('should return an array with all games and the infos of each game', async () => {
		const logStream = fs.createReadStream('./src/log/quake.log');
		const games = await Parser.parse(logStream);

		expect(Array.isArray(games)).toBe(true); // games deve ser um array;

		games.forEach((game) => {
			expect(Array.isArray(game.players)).toBe(true); // players deve ser um array.
			expect(game.players.length).toBeGreaterThanOrEqual(1); // players deve conter no mínimo 1 player.
			expect(game.players).not.toContain('<world>'); // players não pode conter "<world>".

			expect(game.kills instanceof Object).toBe(true); // kills deve ser um objeto.
			expect(game.kills).not.toContain('<world>'); // kills não pode conter "<world>".

			// a pontuação de todos os players deve ser do tipo number.
			for (const player in game.kills) {
				expect(typeof game.kills[player]).toBe('number');
			}

			expect(typeof game.total_kills).toBe('number'); // total_kills deve ser do tipo number.
			expect(game.total_kills).toBeGreaterThanOrEqual(0); // total_kills não pode ser negativo
		});
	});
});
