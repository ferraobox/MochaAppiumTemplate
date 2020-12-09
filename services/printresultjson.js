const fs = require('fs');
let obj = {};
module.exports = {
	writeResult: () => {
		return new Promise((resolve, reject) => {
			obj = { result: process.env.TEST_FAILED };
			const json = JSON.stringify(obj);
			const fileresult = `./reports/result${process.env.DEVICE}.json`;
			fs.writeFile(fileresult, json, 'utf8', (err) => {
				if (err) reject(err);
				resolve();
			});
		});
	},
};
