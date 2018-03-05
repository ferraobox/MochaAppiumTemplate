var makeTest = require('../helpers/setup').makeTest;
var data = require('../data/data');
var assert = require('chai').assert;
var expect = require('chai').expect;

//var Loginpage = process.env.OS.toLocaleLowerCase() === 'ios' ? require('../pageObjects/iosloginPage') : require('../pageObjects/loginPage');
var ExamplpePage = require('../pageObjects/examplePage');

makeTest("Example Test - E2E -", function (setupdriver) {
  var driver = setupdriver;
  examplpePage = new ExamplpePage(driver);

  it("Swipe OnBoard to register", async function () {
    await examplpePage.clickElement();
    await examplpePage.moveToDownTo('exampleSelector3');
    expect(await examplpePage.buttonDisplayed()).to.be.true;
    return driver;
  });
  
});
