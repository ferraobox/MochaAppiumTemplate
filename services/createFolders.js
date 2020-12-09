const fs = require('fs');
module.exports = () => {
	const folders = ['./images/fails', './reports'];
	folders.forEach(folderPath => {
		if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
	});
};
