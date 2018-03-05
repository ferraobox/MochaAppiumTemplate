require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
//Set up driver
var wd = require("wd"),
  _ = require('underscore'),
  actions = require('./actions'),
  serverConfigs = require('./appium-servers');
//Add custom methos for ONE components
wd.addPromiseChainMethod('swipeTo', actions.swipeTo);
wd.addPromiseChainMethod('moveToDownXpath', actions.moveToDownXpath);
wd.addPromiseChainMethod('moveToDownAccessibilityId', actions.moveToDownAccessibilityId);
wd.addPromiseChainMethod('moveToUpXpath', actions.moveToUpXpath);
wd.addPromiseChainMethod('slideToRightXpath', actions.slideToRightXpath);
wd.addPromiseChainMethod('screenShot', actions.screenShot);
wd.addPromiseChainMethod('compareScreenshots', actions.compareScreenshots);
//Set up asserts
chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;
//Configure driver
var driver = wd.promiseChainRemote(serverConfigs.local);
require("./logging").configure(driver);
var desired = require("./caps")[process.env.DEVICE];
//External Services
var { jiraService } = require('../services/jira');
var todayGenerator = require('../services/getDate')

//Make test hooks are executed before and after of each test, for hooks before the execution, you should go to mocha.prepare
function makeTest(desc, cb) {
  describe(desc, function () {
    var runTest = true;
    var specs = [];
    this.timeout(900000);

    before(function () {
      return driver.init(desired).setImplicitWaitTimeout(10000);
    });

    beforeEach(function(){
      if (runTest === false) this.skip();
    });

    after(function () {
      return driver
        .quit()
        .finally(function () {
          console.log('End - Test ' + desc + ' -');
        });
    });

    afterEach(async function () {
      if (this.currentTest.state === 'passed') {
        console.log('\x1b[32m%s\x1b[0m', '> [ ' + process.env.DEVICE + ' ]: ' + this.currentTest.title + ' -> passed');
        let step = { description: this.currentTest.title, status: this.currentTest.state }
        specs.push(step);
      } else {
        runTest = false;
        process.env.TEST_FAILED = true;
        console.log('\x1b[31m%s\x1b[0m', '> [ ' + process.env.DEVICE + ' ]: ' + this.currentTest.title + ' -> ' + this.currentTest.state);
        var screenshot = 'fails/'+todayGenerator().replace(/\//g, '-').replace(/\:/g, '-')+'-' + this.currentTest.title;
        await driver.screenShot(screenshot);
        let step = { description: this.currentTest.title, status: this.currentTest.state }
        specs.push(step);
        let resultsTest = { fullName: desc, specs: specs };
        if (process.env.JIRA_ISSUE_CREATION === 'true') await jiraService(resultsTest).then(jsonIssue => console.log('Issue JIRA: ', jsonIssue));
      }
    });

    cb(driver);
  });
};

exports.makeTest = makeTest;
