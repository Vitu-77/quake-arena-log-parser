const fs = require('fs');
const path = require('path');

module.exports = {
	readFile: async () => {
		const log = await fs.readFileSync(
			path.resolve(__dirname, '..', 'log', 'quake.log'),
			'ascii',
			(error, data) => {
				if (error) throw error;
			}
        );
        
        return log;
    },
};
