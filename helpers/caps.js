
var path = require("path")
//this case for local apps, in case the external apps, yo can fill the fields on helpers's apps
var appspath = path.join(__dirname, '../apps');
//ONE app
exports.iphoneX = {
  'appium-version': '1.7.2',
    automationName: 'XCUITest',
    platformName: 'iOS',
    platformVersion: '11.2',
    deviceName: 'iPhone X',
    app: appspath+'/example.app',
    browserName: '',
    xcodeOrgId: '',
    xcodeSigningId: "iPhone Developer",
    fullReset: true
};

exports.iphone7 = {
  'appium-version': '1.7.2',
    automationName: 'XCUITest',
    platformName: 'iOS',
    platformVersion: '11.2',
    deviceName: 'iPhone 7',
    app: appspath+'/example.app',
    browserName: '',
    xcodeOrgId: '',
    xcodeSigningId: "iPhone Developer",
    fullReset: true
};

exports.iphone6Device = {
  'appium-version': '1.7.2',
    automationName: 'XCUITest',
    platformName: 'iOS',
    platformVersion: '11.0',
    deviceName: 'iPhone 6',
    app: appspath+'/example.ipa',
    browserName: '',
    xcodeOrgId: '',
    xcodeSigningId: "iPhone Developer",
    udid: '',
    fullReset: true
};

exports.Nexus6 = {
  'appium-version': '1.7.2',
  platformName: 'Android',
  platformVersion: '8.0',
  deviceName: 'Android Emulator',
  app: appspath+'',
  browserName: '',
  fullReset: true
};
