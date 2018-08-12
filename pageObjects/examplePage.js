module.exports = class ExamplpePage {
  constructor(driver) {
    this.d = driver;
    this.exampleSelector = '...';
    this.exampleSelector2 = '...';
    this.exampleSelector3 = '...';
  }

  moveToLeft() {
    return this.d.execute('mobile: swipe', { direction: 'left' });
  }

  moveToRight() {
    return this.d.execute('mobile: swipe', { direction: 'right' });
  }

  moveToDown() {
    return this.d.execute('mobile: scroll', { direction: 'down' });
  }
  //custom method on ./helpers/actions.js
  moveToDownTo(ele) {
    return this.d.moveToDownXpath(this[ele]);
  }

  screenshotIsCorrect() {
    let standardDoc = require('path').resolve('images/example.png');
    return this.d
      .waitForElementByAccessibilityId(this.shareAid, 20000)
      .screenShot('example')
      .then(png => {
        let screenshot = require('path').resolve(png);
        return this.d.compareScreenshots(standardDoc, screenshot, 50).then(result => {
          return result;
        });
      });
  }

  clickElement() {
    return this.d
      .waitForElementByXPath(this.exampleSelector, 20000)
      .elementByXPath(this.exampleSelector)
      .click();
  }

  buttonDisplayed() {
    return this.d
      .waitForElementByXPath(this.exampleSelector2, 20000)
      .elementByXPath(this.exampleSelector2)
      .isDisplayed();
  }
};
