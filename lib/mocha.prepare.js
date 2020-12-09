const prepare = require('mocha-prepare');
const removeFiles = require('../services/removeFiles');
const removeApps = require('../services/removeApps');
const { generateReport } = require('../services/reporter/reporter');
const { sendMailTest } = require('../services/nodemailer');
const { sendReportToS3, downloadFileS3 } = require('../services/aws');
const { writeResult } = require('../services/printresultjson');

//Docker
const { execSync } = require('child_process');
//Make test hooks are executed before and after of all execution, for hooks of each test, you should go to helpers/setup
prepare(
	async function (done) {
		const configparams = require(`${process.env.PWD}/config-params`)();
		// called before loading of test cases
		global.isWebView = process.env.DEVICE.includes('Safari') === true || process.env.DEVICE.includes('Chrome') === true ? true : false;
		const appName = `${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}`;
		const appFile = process.env.OS === 'iOS' ? `${appName}.zip` : `${appName}.apk`;
		const localdocumentspath = `${configparams.appslocalpath}/${process.env.APP_NAME}/${process.env.SERVER}`;
		const appspath = process.env.LOCALPATH === 'true' ? localdocumentspath : `${process.env.PWD}/app`;
		//Print execution parameters
		console.log('\x1b[44m', '\x1b[37m', 'SERVER: ' + process.env.SERVER.toUpperCase(), '\x1b[0m');
		console.log('\x1b[44m', '\x1b[37m', 'OS: ' + process.env.OS, '\x1b[0m');
		console.log('\x1b[44m', '\x1b[37m', 'APP: ' + process.env.APP_NAME, '\x1b[0m');
		console.log('\x1b[44m', '\x1b[37m', 'APP version: ' + process.env.APP_VERSION, '\x1b[0m');
		console.log('\x1b[44m', '\x1b[37m', 'Start execution on: ' + process.env.DEVICE, '\x1b[0m');
		console.log('\x1b[44m', '\x1b[37m', 'Jira issues creation set to: ' + process.env.JIRA_ISSUE_CREATION, '\x1b[0m');
		console.log('\x1b[44m', '\x1b[37m', 'Mail sender set to: ' + process.env.MAIL_SEND, '\x1b[0m');
		console.log('\x1b[44m', '\x1b[37m', 'Retry Test: ' + process.env.RETRIES, '\x1b[0m');
		console.log('\x1b[44m', '\x1b[37m', 'MAX RETRIES: ' + process.env.MAXRETRIES, '\x1b[0m');
		console.log('\x1b[44m', '\x1b[37m', 'Local path: ' + process.env.LOCALPATH, '\x1b[0m');
		console.log('\x1b[44m', '\x1b[37m', 'AWS S3: ' + process.env.AWS, '\x1b[0m');
		console.log('\x1b[44m', '\x1b[37m', 'HEADLESS: ' + process.env.HEADLESS, '\x1b[0m');
		console.log('\x1b[44m', '\x1b[37m', 'APP DOWNLOAD: ' + process.env.APP_DOWNLOAD, '\x1b[0m');
		//Global variables setup
		global.translations = require(`${process.env.PWD}/translations/translations.js`)[process.env.APP_NAME][process.env.ENV_NAME][process.env.TRANSLATION].app;
		global.caps = require('../helpers/caps')[process.env.DEVICE];

		if (process.env.AWS === 'true') {
			await removeFiles(`${process.env.PWD}/reports`);
			await removeFiles(`${process.env.PWD}/images/fails`);
		}

		if (process.env.APP_DOWNLOAD === 'true' && isWebView === false)
			downloadFileS3(appFile).then(async () => {
				if (process.env.DOCKER_RUN === 'true') await execSync(`docker cp ${appspath}/${appFile}  container-appium:/home/node`, { stdout: 'inherit' });
				done();
			});
	},
	function (done) {
		// called after all test completes (regardless of errors)
		generateReport()
			.then((pathFile) => sendReportToS3(pathFile))
			.then((pathFile) => sendMailTest(pathFile))
			.then(() => writeResult())
			.then(() => removeApps('./app'))
			.then(() => {
				done();
			})
			.catch((err) => {
				console.log(err);
				done();
			});
	}
);
