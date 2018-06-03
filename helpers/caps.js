const path = require('path');
const appspath = path.join(__dirname, '../apps');
//ONE app
exports.iphoneX = {
  'appium-version': '1.7.2',
  automationName: 'Appium',
  platformName: 'iOS',
  platformVersion: '11.2',
  deviceName: 'iPhone X',
  app: appspath + '',
  browserName: '',
  xcodeOrgId: '',
  xcodeSigningId: 'iPhone Developer',
  clearSystemFiles: true,
  fullReset: true
};
