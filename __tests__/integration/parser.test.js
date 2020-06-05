const request = require('supertest');
const app = require('../../src/app');

describe('Show', () => {
	it('should receive an ID(number) and return a object with game infos filtered by the received ID', async () => {
		const id = 7;
		const response = await request(app).get(`/game/${id}`);

		expect(response.status).toBe(200); // o status de resposta deve ser OK.
		expect(response.body instanceof Object).toBe(true); // a resposta deve ser um objeto.

		// a resposta deve conter id, kills, total_kills e players.
		expect(response.body.game['id']).not.toBeUndefined();
		expect(response.body.game['kills']).not.toBeUndefined();
		expect(response.body.game['total_kills']).not.toBeUndefined();
		expect(response.body.game['players']).not.toBeUndefined();
	});

	it('should return an error 400', async () => {
		const id = 'NaN';
		const response = await request(app).get(`/game/${id}`);

		// o status de resposta deve ser 400, pois o ID fornecido não é um número.
		expect(response.status).toBe(400);
	});
});
