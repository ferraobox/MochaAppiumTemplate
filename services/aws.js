const AWS = require('aws-sdk');
const fs = require('fs');
const moment = require('moment');
const Buffer = require('safer-buffer').Buffer;

// For dev purposes only
AWS.config.update({ accessKeyId: '', secretAccessKey: '' });

module.exports = {
	sendReportToS3: function (pathFile) {
		return new Promise((resolve, reject) => {
			let today = moment().format('YYYY/MMMM/DD');
			today = today.split('/');
			let keyDate = 'automation/' + process.env.APP_NAME + '/' + process.env.OS + '/' + process.env.SERVER.toUpperCase() + '/' + today[0] + '/' + today[1] + '/' + today[2];
			if (process.env.AWS === 'true') {
				// Read in the file, convert it to base64, store to S3
				const fileName = pathFile.split('/')[pathFile.split('/').length - 1];
				keyDate = `${keyDate}/${fileName}`;
				console.log('AWS - S3 - Put report on: ', keyDate);
				fs.readFile(pathFile, 'base64', async (err, data) => {
					if (err) reject(err);
					const s3 = new AWS.S3();
					const base64dfile = new Buffer.from(data, 'base64');
					await s3.putObject(
						{
							Bucket: 'qa-automation',
							Key: keyDate,
							Body: base64dfile,
						},
						function (resp) {
							if (process.env.DEBUG_CONSOLE === 'true') console.log(resp);
							console.log('Successfully uploaded report to AWS - S3');
							resolve(pathFile);
						}
					);
				});
			} else {
				resolve(pathFile);
			}
		});
	},

	sendFailScreenshootToS3: function (pathFile) {
		return new Promise((resolve, reject) => {
			if (process.env.AWS === 'true') {
				let today = moment().format('YYYY/MMMM/DD');
				today = today.split('/');
				let keyDateFail = 'automation/' + process.env.APP_NAME + '/fails/' + process.env.OS + '/' + process.env.SERVER.toUpperCase() + '/' + today[0] + '/' + today[1] + '/' + today[2];
				// Read in the file, convert it to base64, store to S3
				const fileName = pathFile.split('/')[pathFile.split('/').length - 1];
				keyDateFail = `${keyDateFail}/${fileName}`;
				console.log('AWS - S3 - Put fail on: ', keyDateFail);
				fs.readFile(pathFile, 'base64', async (err, data) => {
					if (err) reject(err);
					const s3 = new AWS.S3();
					const base64dfile = new Buffer.from(data, 'base64');
					await s3.putObject(
						{
							Bucket: '',
							Key: keyDateFail,
							Body: base64dfile,
							ACL: 'public-read',
							ContentEncoding: 'base64',
							ContentType: 'image/png',
						},
						function (resp) {
							if (process.env.DEBUG_CONSOLE === 'true') console.log(resp);
							console.log('Successfully uploaded image to AWS - S3');
							resolve(pathFile);
						}
					);
				});
			} else {
				resolve(pathFile);
			}
		});
	},

	downloadFileS3: function (file) {
		return new Promise((resolve, reject) => {
			if (process.env.LOCALPATH === 'true') resolve('');
			else {
				const filePath = `${process.env.PWD}/app/${file}`;
				const bucketName = 'qa-automation';
				const key = `automation/WorkApps/${process.env.APP_NAME}/${process.env.SERVER}/${file}`;
				const s3 = new AWS.S3();
				const params = {
					Bucket: bucketName,
					Key: key,
				};
				s3.getObject(params, (err, data) => {
					if (err) reject(err);
					fs.writeFile(filePath, data.Body, (err) => {
						if (err) reject(err);
						console.log(`${filePath} has been downloaded!`);
						resolve(filePath);
					});
				});
			}
		});
	},

	downloadFile: function (file) {
		return new Promise((resolve, reject) => {
			const bucketName = 'qa-automation';
			const key = `automation/${file}`;
			const s3 = new AWS.S3();
			const params = {
				Bucket: bucketName,
				Key: key,
			};
			s3.getObject(params, (err, data) => {
				if (err) reject(err);
				resolve(data);
			});
		});
	},
};
