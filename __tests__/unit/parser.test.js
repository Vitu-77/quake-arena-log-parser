const Parser = require('../../src/helpers/Parser');

describe('Read', () => {
	it('should read the .log file and @types/jestreturn the file content as a string', async () => {
		const logString = await Parser.readFile();

		expect(typeof logString).toBe('string');
	});
});

