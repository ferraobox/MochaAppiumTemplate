const fs = require('fs');
module.exports = function removeScreenShots() {
	try {
		const files = fs.readdirSync('./images');
		if (files.length > 0)
			for (let i = 0; i < files.length; i++) {
				const filePath = './images/' + files[i];
				const device = process.env.DEVICE;
				const checkDevice = filePath.slice(filePath.length - (4 + device.length), filePath.length - 4) === device ? true : false;
				if (fs.statSync(filePath).isFile() && checkDevice === true) fs.unlinkSync(filePath);
			}
	} catch (e) {
		return e;
	}
};
