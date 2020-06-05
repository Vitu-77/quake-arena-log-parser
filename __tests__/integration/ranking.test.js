const request = require('supertest');
const app = require('../../src/app');

describe('Index', () => {
	it('should return an object with the global ranking of players by kills', async () => {
		const response = await request(app).get('/ranking');

		const ranking = response.body.ranking;

		expect(response.status).toBe(200); // status deve ser OK.
		expect(ranking instanceof Object).toBe(true); // ranking deve ser um objeto iterável.

		for (player in ranking) {
			expect(ranking[player]).not.toBeNaN(); // a pontuação de cada jogador deve ser um número
		}
	});
});
