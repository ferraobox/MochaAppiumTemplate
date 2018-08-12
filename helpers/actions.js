const wd = require('wd'),
  Q = require('q');
const PNGCrop = require('png-crop');
const fs = require('fs');
const resemble = require('../services/resemble');

//Custom methods for ONE components
exports.screenShot = async function(name) {
  let png = await this.takeScreenshot();
  let filename = './images/' + name + process.env.DEVICE + '.png';
  console.log(filename);
  let stream = await fs.createWriteStream(filename);
  stream.write(new Buffer(png, 'base64'));
  stream.end();
  return filename;
};

exports.compareScreenshots = function(screenshot1, screenshot2, percentage) {
  /**
   * @function compareScreenshots
   * @description Compares two screenshots and validates that they look equal.
   * @param {string} screenshot1 Path to the first screenshot to compare
   * @param {string} screenshot2 Path to the second screenshot to compare
   * @param {number} percentage maximum percentage of error accepted to compare the two screenshots
   * @param {string} message Message if the images are equal
   * @returns {boolean}
   */
  return new Promise(resolve => {
    resemble(screenshot1, screenshot2).then(data => {
      console.log('Mismatch percentage is ', data.misMatchPercentage);
      if (data.misMatchPercentage <= percentage) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

exports.cropImage = function(width, heigth, top, left, imagePath) {
  /**
   * @function cropImage
   * @description Crops an image taking 4 position parameters. If paramaters aren't passed into the function, then it takes default parameters.
   * @param {number} width Parameter as a number
   * @param {number} heigth Parameter as a number
   * @param {number} top Parameter as a number
   * @param {number} left Parameter as a number
   * @param {string} imagePath The path of the expected image for being cropped
   */
  const config1 = { width: 400, height: 400, top: 60 };

  this.perform(function(done) {
    PNGCrop.crop(imagePath, imagePath, config1, function(err) {
      if (err) throw err;
      done();
    });
  });
  return this;
};

exports.elementExistXpath = async function(ele) {
  let elem = await this.elementsByXPath(ele);
  return elem.length > 0 ? true : false;
};

exports.hideKeyboardTouch = async function(ele) {
  const size = await this.getWindowSize();
  const startX = Math.ceil(size.width * 0.8);
  const startY = Math.ceil(size.height * 0.4);
  const endY = Math.ceil(size.height * 0.1);
  let action = new wd.TouchAction(this);
  await action
    .press({ x: startX, y: startY })
    .moveTo({ x: 0, y: endY - startY })
    .release()
    .perform();
  return this;
};

exports.moveToDownXpath = async function(ele) {
  let currentTime = new Date().getTime();
  let timeEnd = currentTime + 20000;
  let elementsFound = [];
  let elementFound = false;
  let size = await this.getWindowSize();
  const startX = Math.ceil(size.width * 0.3);
  const startY = Math.ceil(size.height * 0.8);
  const endY = Math.ceil(size.height * 0.2);
  while (currentTime < timeEnd && elementFound === false) {
    currentTime = new Date().getTime();
    let action = new wd.TouchAction(this);
    await action
      .press({ x: startX, y: startY })
      .moveTo({ x: 0, y: endY - startY })
      .release()
      .perform();
    elementsFound = await this.elementsByXPath(ele);
    if (elementsFound.length > 0) elementFound = await this.elementByXPath(ele).isDisplayed();
  }
  return this;
};

exports.moveToDownAccessibilityId = async function(ele) {
  let currentTime = new Date().getTime();
  let timeEnd = currentTime + 20000;
  let elementsFound = [];
  let elementFound = false;
  let size = await this.getWindowSize();
  const startX = Math.ceil(size.width * 0.3);
  const startY = Math.ceil(size.height * 0.8);
  const endY = Math.ceil(size.height * 0.2);
  while (currentTime < timeEnd && elementFound === false) {
    currentTime = new Date().getTime();
    let action = new wd.TouchAction(this);
    await action
      .press({ x: startX, y: startY })
      .moveTo({ x: 0, y: endY - startY })
      .release()
      .perform();
    elementsFound = await this.elementsByAccessibilityId(ele);
    if (elementsFound.length > 0) elementFound = await this.elementByAccessibilityId(ele).isDisplayed();
  }
  return this;
};

exports.moveToUpXpath = async function(ele) {
  let currentTime = new Date().getTime();
  let timeEnd = currentTime + 20000;
  let elementsFound = [];
  let elementFound = false;
  let size = await this.getWindowSize();
  const startX = Math.ceil(size.width * 0.5);
  const startY = Math.ceil(size.height * 0.3);
  const endY = Math.ceil(size.height * 0.7);
  while (currentTime < timeEnd && elementFound === false) {
    currentTime = new Date().getTime();
    let action = new wd.TouchAction(this);
    await action
      .press({ x: startX, y: startY })
      .moveTo({ x: 0, y: endY - startY })
      .release()
      .perform();
    elementsFound = await this.elementsByXPath(ele);
    if (elementsFound.length > 0) elementFound = await this.elementByXPath(ele).isDisplayed();
  }
  return this;
};

exports.moveToUpAccessibilityId = async function(ele) {
  let currentTime = new Date().getTime();
  let timeEnd = currentTime + 20000;
  let elementsFound = [];
  let elementFound = false;
  let size = await this.getWindowSize();
  const startX = Math.ceil(size.width * 0.8);
  const startY = Math.ceil(size.height * 0.2);
  const endY = Math.ceil(size.height * 0.8);
  while (currentTime < timeEnd && elementFound === false) {
    currentTime = new Date().getTime();
    let action = new wd.TouchAction(this);
    await action
      .press({ x: startX, y: startY })
      .moveTo({ x: 0, y: endY - startY })
      .release()
      .perform();
    elementsFound = await this.elementsByAccessibilityId(ele);
    if (elementsFound.length > 0) elementFound = await this.elementByAccessibilityId(ele).isDisplayed();
  }
  return this;
};

exports.slideToRightXpath = async function(ele, _startPosition) {
  //start position should be percentage 0 - 1, if you want 50%, you should write 0,5
  let startPosition = _startPosition || 0;
  let windowSize = await this.getWindowSize();
  let sizeElement = await this.waitForElementByXPath(ele, 20000)
    .elementByXPath(ele)
    .getSize();
  let location = await this.elementByXPath(ele).getLocation();
  let action = new wd.TouchAction(this);
  console.log('Dimensiones: ', sizeElement.width, '-', sizeElement.height, ' Location: ', location.x, '-', location.y);
  const xposition = sizeElement.width * startPosition;
  const startX = Math.ceil(location.x + xposition + 11);
  const startY = Math.ceil(location.y + 11);
  const endX = Math.ceil(windowSize.width * 0.8);
  console.log('Touch before: ', startX, '-', startY, ' Touch after: ', endX, '-', startY);
  await action
    .press({ x: startX, y: startY })
    .moveTo({ x: endX - startX, y: 0 })
    .release()
    .perform();
  return this;
};

exports.swipeTo = async function(direction) {
  let size = await this.getWindowSize();
  const startY = Math.ceil(size.height * 0.6);
  //Default right swipe
  const startX = Math.ceil(size.width * 0.1);
  const endX = Math.ceil(size.width * 0.9);
  let action = new wd.TouchAction(this);
  await action
    .press({ x: direction === 'right' ? startX : endX, y: startY })
    .moveTo({ x: direction === 'right' ? endX - startX : startX - endX, y: 0 })
    .release()
    .perform();
  return this;
};

//Custom methos for actions
exports.pinch = function(el) {
  return Q.all([el.getSize(), el.getLocation()]).then(
    function(res) {
      let size = res[0];
      let loc = res[1];
      let center = {
        x: loc.x + size.width / 2,
        y: loc.y + size.height / 2
      };
      let a1 = new wd.TouchAction(this);
      a1.press({ el: el, x: center.x, y: center.y - 100 })
        .moveTo({ el: el })
        .release();
      let a2 = new wd.TouchAction(this);
      a2.press({ el: el, x: center.x, y: center.y + 100 })
        .moveTo({ el: el })
        .release();
      let m = new wd.MultiAction(this);
      m.add(a1, a2);
      return m.perform();
    }.bind(this)
  );
};

exports.zoom = function(el) {
  return Q.all([this.getWindowSize(), this.getLocation(el)]).then(
    function(res) {
      let size = res[0];
      let loc = res[1];
      let center = {
        x: loc.x + size.width / 2,
        y: loc.y + size.height / 2
      };
      let a1 = new wd.TouchAction(this);
      a1.press({ el: el })
        .moveTo({ el: el, x: center.x, y: center.y - 100 })
        .release();
      let a2 = new wd.TouchAction(this);
      a2.press({ el: el })
        .moveTo({ el: el, x: center.x, y: center.y + 100 })
        .release();
      let m = new wd.MultiAction(this);
      m.add(a1, a2);
      return m.perform();
    }.bind(this)
  );
};
