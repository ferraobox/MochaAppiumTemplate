#!/usr/bin/env node
require('colors');
const fs = require('fs');
const prog = require('caporal');
const createFolders = require('../services/createFolders');
const { spawn } = require('child_process');
const { fixmailparserbug } = require('../services/fixmailparserbug');
const downloadFileS3 = require('../services/aws').downloadFile;
// var sauceConnectLauncher = require('sauce-connect-launcher');
//Fix mailparser from maillistener bug:
fixmailparserbug();
createFolders();

prog
	.version('1.0.0')
	.description('Appium runner')
	.option('-d, --device <device>', 'Device (of list of devices) example: -d device1,device2..\n · iphoneX\n · iphone7\n · iphone6Device\n · Nexus6', prog.LIST)
	.option('-a, --app <app>', 'APP to run', prog.STRING)
	.option('-s --server <server>', 'Current server (PRO, PRE or DEV)', prog.STRING)
	.option('-t, --test <path>', 'Path to test', prog.STRING)
	.option('-j --jiraIssueCreation <jiraIssueCreation>', 'Create JIRA issue when a test fails (bool value), Default False', prog.BOOL)
	.option('-m --mailSend <mailSend>', 'Report mail send (bool value), default false', prog.BOOL)
	.option('-r --retries <retries>', 'Check to retry test when it fails', prog.BOOL)
	.option('-i --inspect <inspect>', 'node --inspect-brk, activate (true or false)', prog.BOOL)
	.option('-c --debugConsole <debugConsole>', 'Driver logs in console, activate (true or false)', prog.BOOL)
	.option('-w --aws <aws>', 'Put file on amazon web services S3 (true or false)', prog.BOOL)
	.option('-v --version <version>', 'Current version APP (2.8 by Default)', prog.STRING)
	.option('-l --headless <headless>', 'headless activate by default false (true or false)', prog.BOOL)
	.option('-n --maxretries <maxretries>', 'custmon max retries, by default 1 (Number)', prog.STRING)
	.option('-p --localpath <localpath>', 'localpath for apps deactivate by default false (true or false)', prog.BOOL)
	.option('-e, --env <env>', 'Environment of country to run', prog.STRING)
	.option('-T --translation <translation>', 'Select language of app (de or en, default de)', prog.STRING)
	.option('-D --docker <docker>', 'Run Android test from Appium docker (ONLY ANDROID)', prog.BOOL)
	.option('-C --continuousintegration <continuousintegration>', 'Not install app, only for CI/Jenkins', prog.BOOL)
	.option('-A --appdownload <appdownload>', 'Download the binary app by default true (true or false)', prog.BOOL)
	.option('-R --screenRecord <screenRecord>', 'Record MP4 video for each test then save it if fails', prog.BOOL)
	.option('-G, --tagSuite <tagSuite>', 'Tag or id to run only specific test, #example, (In test name will be #example#,#example2#,#example3#)', prog.STRING)
	.action(function (args, options) {
		if (!options || !options.device || !options.app || !options.env || !options.server) {
			throw new Error('*** Parameters: app, device, env and server are mandatory');
		}
		executeTests(options);
	});

prog.parse(process.argv);

async function executeTests(options) {
	const devices = options.device;
	const test = options.test ? options.test : 'src/test/app';
	const jiraIssueCreation = options.jiraIssueCreation;
	const mailSend = options.mailSend;
	const retries = options.retries;
	const maxretries = options.maxretries;
	const localpath = options.localpath;
	const debbugger = options.inspect ? 'node --inspect-brk' : '';
	const awsOption = options.aws;
	const serverOption = options.server;
	const versionAppOption = options.version;
	const debugConsole = options.debugConsole;
	const headlessOption = options.headless;
	const translation = options.translation ? options.translation.toLowerCase() : 'de';
	const environment = options.env ? options.env.toUpperCase() : 'DE';
	const docker = options.docker;
	const app = options.app.toLowerCase();
	const continuousintegration = options.continuousintegration;
	const appdownload = options.appdownload;
	const screenRecord = options.screenRecord;
	const tagSuite = options.tagSuite ? options.tagSuite : '';

	await getConfgS3('common.env');
	await getConfgS3(`common-${serverOption}.env`);
	require('dotenv').config({ path: `${process.env.PWD}/config/envs/.env` });
	require('dotenv').config({ path: `${process.env.PWD}/config/envs/common.env` });
	require('dotenv').config({ path: `${process.env.PWD}/config/envs/common-${serverOption}.env` });
	fs.unlinkSync(`${process.env.PWD}/config/envs/common.env`);
	fs.unlinkSync(`${process.env.PWD}/config/envs/common-${serverOption}.env`);

	devices.forEach((device) => {
		const env = Object.create(process.env);
		env.DEVICE = device;
		env.OS = device.search('iphone') >= 0 ? 'iOS' : 'Android';
		env.JIRA_ISSUE_CREATION = jiraIssueCreation ? jiraIssueCreation : false;
		env.MAIL_SEND = mailSend ? mailSend : false;
		env.RETRIES = retries ? retries : false;
		env.MAXRETRIES = retries && maxretries ? maxretries : retries && !maxretries ? 1 : 0;
		env.LOCALPATH = localpath ? localpath : false;
		env.DEBUG_CONSOLE = debugConsole ? debugConsole : false;
		env.AWS = awsOption ? awsOption : false;
		env.SERVER = serverOption ? serverOption : 'pro';
		env.APP_NAME = app;
		env.APP_VERSION = versionAppOption ? versionAppOption : '';
		env.RUNTEST = test;
		env.TEST_FAILED = false;
		env.HEADLESS = headlessOption ? headlessOption : false;
		env.ENV_NAME = environment;
		env.TRANSLATION = translation;
		env.DOCKER_RUN = docker ? docker : false;
		env.APP_FILE_NAME = getAppFileName(device.search('iphone') >= 0 ? 'iOS' : 'Android');
		env.CI_APP = continuousintegration ? continuousintegration : false;
		env.APP_DOWNLOAD = appdownload === false ? false : true;
		env.RECORDING_VIDEO = screenRecord ? screenRecord : false;
		env.TAGSUITE = tagSuite;
		env.INSPECT_MODE = debbugger !== '' ? true : false;

		const testInProcess = spawn(`MOCHA_FILE=${process.env.PWD}/reports/${device}.xml ${debbugger} ${process.env.PWD}/node_modules/.bin/_mocha ${test} --reporter mocha-junit-reporter --require ${process.env.PWD}/node_modules/wgautomationapps/lib/mocha.prepare.js --recursive --timeout 900000`, {
			stdio: ['inherit', 'inherit', 'inherit'],
			shell: true,
			env,
		});

		testInProcess.on('close', (code) => {
			const jsonresult = require(`${process.env.PWD}/reports/result${device}.json`);
			code = jsonresult.result === 'true' ? code : 0;
			console.log(`Process finished for device: ${device} - ${app}`);
			if (code !== 0) throw new Error(`EXIT: CODE: ${code} -- > Test failed`);
		});
		testInProcess.on('error', function () {
			console.log(arguments);
		});
	});
}

async function getConfgS3(file) {
	const data = await downloadFileS3(file);
	return fs.writeFileSync(`${process.env.PWD}/config/envs/${file}`, data.Body);
}

function getAppFileName(os) {
	const configparams = require(`${process.env.PWD}/config-params`)();
	if (os === 'iOS') {
		if (configparams.hasOwnProperty('iosappname')) return configparams.iosappname;
		else throw new Error(`***** Not app name for IOS defined on: ${process.env.PWD}/config-params}`);
	} else {
		if (configparams.hasOwnProperty('androidappname')) return configparams.androidappname;
		else throw new Error(`***** Not app name for ANDROID defined on: ${process.env.PWD}/config-params}`);
	}
}
