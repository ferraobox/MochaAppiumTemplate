var wd = require('wd'),
  Q = require('q');
var PNGCrop = require('png-crop');
var fs = require('fs');
var resemble = require('../services/resemble');

//Custom methods for ONE components
exports.screenShot = async function (name){
 var png = await this.takeScreenshot();
  let filename = './images/'+name+process.env.DEVICE+'.png';
  console.log(filename);
  var stream = await fs.createWriteStream(filename);
  stream.write(new Buffer(png, 'base64'));
  stream.end();
};

exports.compareScreenshots = function (screenshot1, screenshot2, percentage) {
  /**
   * @function compareScreenshots
   * @description Compares two screenshots and validates that they look equal.
   * @param {string} screenshot1 Path to the first screenshot to compare
   * @param {string} screenshot2 Path to the second screenshot to compare
   * @param {number} percentage maximum percentage of error accepted to compare the two screenshots
   * @param {string} message Message if the images are equal
   * @returns {boolean}
   */
  resemble(screenshot1, screenshot2, data => {
    console.log('mismatch percentage is ', data.misMatchPercentage);
    if (data.misMatchPercentage <= percentage) {
      return true;
    } else {
      return false;
    }
  });
};

exports.cropImage = function (width, heigth, top, left, imagePath) {
  /**
   * @function cropImage
   * @description Crops an image taking 4 position parameters. If paramaters aren't passed into the function, then it takes default parameters.
   * @param {number} width Parameter as a number
   * @param {number} heigth Parameter as a number
   * @param {number} top Parameter as a number
   * @param {number} left Parameter as a number
   * @param {string} imagePath The path of the expected image for being cropped
   */
  var config1 = { width: 400, height: 400, top: 60 };

  this.perform(function (done) {
    PNGCrop.crop(imagePath, imagePath, config1, function (err) {
      if (err) throw err;
      done();
    });
  });
  return this;
};

exports.moveToDownXpath = async function (ele) {
  var currentTime = new Date().getTime();
  var timeEnd = currentTime + 20000;
  var elementFound = [];
  var size = await this.getWindowSize();
  const startX = Math.ceil(size.width * 0.3);
  const startY = Math.ceil(size.height * 0.8);
  const endY = Math.ceil(size.height * 0.2);
  while (currentTime < timeEnd && elementFound.length < 1) {
    currentTime = new Date().getTime();
    let action = new wd.TouchAction(this);
    await action
      .press({ x: startX, y: startY })
      .moveTo({ x: startX, y: endY })
      .release()
      .perform();
    elementFound = await this.elementsByXPath(ele);
  }
  return this;
};

exports.moveToDownAccessibilityId = async function (ele) {
  var currentTime = new Date().getTime();
  var timeEnd = currentTime + 20000;
  var elementFound = [];
  var size = await this.getWindowSize();
  const startX = Math.ceil(size.width * 0.3);
  const startY = Math.ceil(size.height * 0.8);
  const endY = Math.ceil(size.height * 0.2);
  while (currentTime < timeEnd && elementFound.length < 1) {
    currentTime = new Date().getTime();
    let action = new wd.TouchAction(this);
    await action
      .press({ x: startX, y: startY })
      .moveTo({ x: startX, y: endY })
      .release()
      .perform();
    elementFound = await this.elementsByAccessibilityId(ele);
  }
  return this;
};

exports.moveToUpXpath = async function (ele) {
  var currentTime = new Date().getTime();
  var timeEnd = currentTime + 20000;
  var elementFound = [];
  var size = await this.getWindowSize();
  const startX = Math.ceil(size.width * 0.3);
  const startY = Math.ceil(size.height * 0.2);
  const endY = Math.ceil(size.height * 0.8);
  while (currentTime < timeEnd && elementFound.length < 1) {
    currentTime = new Date().getTime();
    let action = new wd.TouchAction(this);
    await action
      .press({ x: startX, y: startY })
      .moveTo({ x: startX, y: endY })
      .release()
      .perform();
    elementFound = await this.elementsByXPath(ele);
  }
  return this;
};

exports.slideToRightXpath = function (ele) {
  return this
    .waitForElementByXPath(ele, 20000)
    .elementByXPath(ele).getLocation()
    .then((loc) => {
      let action = new wd.TouchAction(this);
      const startX = loc.x + 16;
      const startY = loc.y + 16;
      const endX = startX + 150;
      return action
        .press({ x: startX, y: startY })
        .wait(1000)
        .moveTo({ x: endX, y: startY })
        .release()
        .perform();
    });
};

exports.swipeTo = async function (direction) {
  var size = await this.getWindowSize();
  const startY = Math.ceil(size.height * 0.6);
  //Default right swipe
  const startX = Math.ceil(size.width * 0.1);
  const endX = Math.ceil(size.width * 0.9);
  let action = new wd.TouchAction(this);
  await action
    .press({ x: direction === 'right' ? startX : endX, y: startY })
    .moveTo({ x: direction === 'right' ? endX : startX, y: startY })
    .release()
    .perform();
  return this;
};
