const fs = require('fs');
module.exports = function removeApps(dirPath) {
	return new Promise((resolve, reject) => {
		try {
			const files = fs.readdirSync(dirPath);
			if (files.length > 0) {
				files.forEach((file) => {
					const filePath = `${dirPath}/${file}`;
					if (fs.statSync(filePath).isFile()) {
						if (checkApp(file)) fs.unlinkSync(filePath);
					}
				});
			}
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

function checkApp(file) {
	return file.includes('.zip') || file.includes('.apk') ? true : false;
}
