const { execSync } = require('child_process');
//External Services
const removeScreenShots = require('../services/removeScreenShots');
const { jiraService } = require('../services/jira');
const { sendFailScreenshootToS3 } = require('../services/aws');
const moment = require('moment');
const data = require(`${process.env.PWD}/config/data`)[process.env.SERVER];

//Make test hooks are executed before and after of each test, for hooks before the execution, you should go to mocha.prepare
const makeTest = function (desc, cb, retries) {
	//setup tag suite
	global.tagSuite = process.env.TAGSUITE;
	//Setup Driver
	const _driver = require('./setupDriver');
	//Desired capabilities
	const desired = require('./caps')[process.env.DEVICE];
	// Check id tagSuite is defined and apply to pool of test.
	const noRunSuiteConditionalTag = manageCountryTags(desc);
	//Retries test counter
	let retriesCount = retries || 1;

	(noRunSuiteConditionalTag === true ? xdescribe : describe)(desc, () => {
		before(function () {
			try {
				//setUp global variables for test
				global.tagNoRunTest = '';
				global.tagOnlyRunTest = '';
				global.runTest = true;
				global.specs = [];
				//SetUp page Objects, data environment and driver
				let pageObjects = getPageObjects();
				pageObjects = pageObjects.flat();
				pageObjects.forEach((po) => {
					global[po.file] = require(`${po.path}`);
				});
				global.dataEnv = data();
				console.log(`Start - Test: ${desc} -`.cyan);
				global.driver = _driver;
			} catch (err) {
				process.env.TEST_FAILED = true;
				console.log(err);
				throw new Error(err);
			}
			return driver
				.init(desired)
				.setImplicitWaitTimeout(10000)
				.then(() => {
					if (process.env.RECORDING_VIDEO === 'true') return driver.startRecordingScreen();
					else return this;
				})
				.catch((err) => {
					process.env.TEST_FAILED = true;
					console.log(err);
				});
		});

		beforeEach(function () {
			//check if any condition tag is setted for skip.
			let runTestConditionalTag = false;
			let testTag = this.currentTest.title;
			testTag = testTag.match(/(?:#)([A-Za-z0-9]+)(?:#)/gm);
			if (testTag !== null) testTag = testTag.join('');
			if (tagNoRunTest !== '') runTestConditionalTag = testTag === tagNoRunTest;
			else if (tagOnlyRunTest !== '') runTestConditionalTag = testTag !== tagOnlyRunTest;
			//
			if (runTest === false || runTestConditionalTag === true) this.skip();
		});

		after(async function () {
			if (process.env.RECORDING_VIDEO === 'true') await driver.stopRecordingScreen('', false);
			return driver
				.quit()
				.then(() => {
					console.log(`End - Test: ${desc} -`.grey);
					//Warning!! IF YOU ARE RUN SEVERAL SIMULATORS, THIS WILL KILL ALL INSTANCES
					if (process.env.OS === 'iOS' && process.env.DEVICE.search('Device') < 0 && process.env.HEADLESS === 'false' && process.env.CI_APP === 'false') execSync('killall -9 "Simulator"');
				})
				.catch((err) => {
					if (process.env.DEBUG_CONSOLE === 'true') console.log(err);
					console.log('* Session finished'.red);
				});
		});

		afterEach(async function () {
			await removeScreenShots();
			if (this.currentTest.state === 'passed') {
				console.log('\x1b[32m%s\x1b[0m', '> [ ' + process.env.DEVICE + ' ]: ' + this.currentTest.title + ' -> passed');
				const step = { description: this.currentTest.title, status: this.currentTest.state };
				specs.push(step);
			} else if (this.currentTest.state === 'failed') {
				runTest = false;
				console.log('\x1b[31m%s\x1b[0m', '> [ ' + process.env.DEVICE + ' ]: ' + this.currentTest.title + ' -> ' + this.currentTest.state);
				const screenshot = await moment().format('DD-MM-YY-HHmm');

				if (process.env.RECORDING_VIDEO === 'true') {
					const video = await driver.sleep(5000).stopRecordingScreen(`${screenshot}-${this.currentTest.title.replace(/ /g, '')}`, true);
					console.log(`** Saved video in: ${video}`.yellow);
				}

				if (process.env.RETRIES === 'true' && retriesCount <= process.env.MAXRETRIES) {
					retriesCount++;
					return driver
						.screenShot(`fails/${screenshot}-${this.currentTest.title.replace(/ /g, '')}`)
						.quit()
						.then(() => {
							console.log(`End - Test: ${desc} -`.grey);
							//Warning!! IF YOU ARE RUN SEVERAL SIMULATORS, THIS WILL KILL ALL INSTANCES
							if (process.env.OS === 'iOS' && process.env.DEVICE.search('Device') < 0 && process.env.HEADLESS === 'false') execSync('killall -9 "Simulator"');
						})
						.then(() => makeTest('- RETRY - ' + desc, cb, retriesCount))
						.catch((err) => {
							console.log(err);
						});
				} else {
					const screenshotPath = await driver.screenShot(`fails/${screenshot}-${this.currentTest.title.replace(/ /g, '')}`);
					await sendFailScreenshootToS3(screenshotPath);
					process.env.TEST_FAILED = true;
					const step = { description: this.currentTest.title, status: this.currentTest.state };
					specs.push(step);
					const resultsTest = { fullName: desc, specs: specs };
					if (process.env.JIRA_ISSUE_CREATION === 'true') await jiraService(resultsTest).then((jsonIssue) => console.log('Issue JIRA: ', jsonIssue));
				}
			} else {
				return this;
			}
		});

		cb();
	});
};

function getPageObjects(_path) {
	const fs = require('fs');
	const basePath = `${process.env.PWD}/src/pageObjects/${isWebView === true ? 'mobileweb' : process.env.OS}`;
	const path = _path || basePath;

	return fs.readdirSync(path).map((f) => {
		const isFile = fs.lstatSync(`${path}/${f}`).isDirectory();
		if (isFile === true) {
			return getPageObjects(`${path}/${f}`);
		} else
			return {
				path: `${path}/${f}`,
				file: f.split('.')[0],
			};
	});
}

function manageCountryTags(desc) {
	const countries = process.env.COUNTRIES.split(',');
	const currentCountryIndex = countries.indexOf(process.env.ENV_NAME);
	let testTags = desc.match(/(?:#)([A-Za-z0-9]+)(?:#)/gm);
	if (testTags !== null) testTags = testTags.map((tag) => tag.toUpperCase());
	//Define in this variable de default behavior if country is not informed
	let countryAvailable = true;
	if (currentCountryIndex >= 0) countries.splice(currentCountryIndex, 1);
	//Checks
	if (testTags === null && tagSuite === '') return false;
	else {
		if (testTags !== null) {
			//Check disabled test
			if (testTags.includes('#NA#')) return true;
			//Check available in country env
			if (testTags.includes(`#${process.env.ENV_NAME}#`)) countryAvailable = true;
			else if (countries.some((country) => testTags.includes(`#${country}#`))) return true;
			//Check test tags
			if (tagSuite === '' && countryAvailable === true) return false;
			else {
				const tags = tagSuite.split(',').map((tag) => tag.toUpperCase());
				if (!testTags.some((tag) => tags.includes(tag))) return true;
				else if (countryAvailable === true) return false;
				else return true;
			}
		} else return true;
	}
}

exports.makeTest = makeTest;
