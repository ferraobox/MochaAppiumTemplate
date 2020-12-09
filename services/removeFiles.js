const fs = require('fs');
module.exports = function removeFiles(dirPath) {
	try {
		const files = fs.readdirSync(dirPath);
		if (files.length > 0)
			for (let i = 0; i < files.length; i++) {
				const filePath = dirPath + '/' + files[i];
				if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
			}
	} catch (e) {
		return e;
	}
};
