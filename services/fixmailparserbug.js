const replace = require('replace-in-file');
const bugFile = `${process.env.PWD}/node_modules/mail-listener2/node_modules/mailparser/lib/mailparser.js`;
exports.fixmailparserbug = function () {
	return new Promise((resolve) => {
		const options = {
			files: bugFile,
			from: 'defaultExt = mime.extension(contentType);',
			to: 'defaultExt = mime.getExtension(contentType);',
		};
		replace(options)
			.then((changes) => {
				console.log('Fix mailparser bug, Modified files:', changes.join(', '));
				resolve();
			})
			.catch((error) => {
				console.error('No files match the pattern:', error);
				resolve();
			});
	});
};
