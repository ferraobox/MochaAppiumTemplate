#!/usr/bin/env node
const prog = require('caporal');
const path = require('path');
const { spawn } = require('child_process');
// var sauceConnectLauncher = require('sauce-connect-launcher');

prog
    .version('1.0.0')
    .description('Mocha - Appium runner')
    .option('-d, --device <device>', 'Device (of list of devices) example: -d device1,device2..\n · iphoneX\n · iphone7\n · iphone6Device\n · Nexus6', prog.LIST)
    .option('-t, --test <path>', 'Path to test', prog.STRING)
    .option('-j --jiraIssueCreation <jiraIssueCreation>', 'Create JIRA issue when a test fails (bool value), Default False', prog.BOOL)
    .option('-m --mailSend <mailSend>', 'Report mail send (bool value), default false', prog.BOOL)
    .action(function (args, options) {
        if (!options) {
            console.log('devices are mandatory');
            return;
        }
        executeTests(options);
    });

prog.parse(process.argv);

function executeTests(options) {
    const devices = options.device;
    const test = options.test || '';
    const jiraIssueCreation = options.jiraIssueCreation;
    const mailSend = options.mailSend;

    devices.forEach((device) => {
        const env = Object.create(process.env);
        env.DEVICE = device;
        env.OS = device.search("iphone") ? 'Android' : 'iOS';
        env.JIRA_ISSUE_CREATION = jiraIssueCreation ? jiraIssueCreation : false;
        env.MAIL_SEND = mailSend ? mailSend : false;
        env.TEST_FAILED = false;

        const testInProcess = spawn(`MOCHA_FILE=./reports/${device}.xml ${__dirname}/node_modules/.bin/mocha ${test} --reporter mocha-junit-reporter --require ${__dirname}/mocha.prepare.js --recursive`, {
            stdio: ['inherit', 'inherit', 'inherit'],
            shell: true,
            env
        });

        testInProcess.on('close', (code) => {
            console.log(`Process finished for device: ${device}`);
            if (typeof next === 'function') {
                next(null);
            }
            if(code!==0) throw new Error('EXIT: CODE: ' + code + ' -- > Test failed');
        });
        testInProcess.on('error', function () {
            console.log(arguments);
        });
    })
}
