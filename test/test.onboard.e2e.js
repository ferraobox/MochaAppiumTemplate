const makeTest = require('../helpers/setup').makeTest;
const data = require('../data/data');
const expect = require('chai').expect;

//var Loginpage = process.env.OS.toLocaleLowerCase() === 'ios' ? require('../pageObjects/iosloginPage') : require('../pageObjects/loginPage');
const ExamplpePage = require('../pageObjects/examplePage');

makeTest('Example Test - E2E -', function(setupdriver) {
  const driver = setupdriver;
  examplpePage = new ExamplpePage(driver);

  it('Swipe OnBoard to register', async function() {
    await examplpePage.clickElement();
    await examplpePage.moveToDownTo('exampleSelector3');
    expect(await examplpePage.buttonDisplayed()).to.be.true;
    expect(await examplpePage.screenshotIsCorrect()).to.be.true;
    return driver;
  });
});
