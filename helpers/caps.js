const configparams = require(`${process.env.PWD}/config-params`)();
//Local path only for mac, you must have the path ./Documents/OneApps/${process.env.SERVER}

const localdocumentspath = `${configparams.appslocalpath}/${process.env.APP_NAME}/${process.env.SERVER}`;
const dockerPath = '/home/node';
const appspath = process.env.LOCALPATH === 'true' && process.env.DOCKER_RUN === 'false' ? localdocumentspath : process.env.DOCKER_RUN === 'true' && process.env.OS === 'Android' ? dockerPath : `${process.env.PWD}/app`;
const appPackageAndroid = configparams.appPackageAndroid;
const appActivityAndroid = configparams.appActivityAndroid;
const bundleId = configparams.bundleId;

function getLocale() {
	if (process.env.OS === 'iOS') return `${process.env.TRANSLATION}_${process.env.ENV_NAME}`;
	else return process.env.TRANSLATION;
}

//ECDD4EE4-37A0-4C18-AEFF-15B9C6974554
//ONE app
exports.iphoneX = {
	automationName: 'XCUITest',
	platformName: 'iOS',
	platformVersion: '12.1',
	deviceName: 'iPhone XS',
	app: process.env.CI_APP === 'true' ? '' : appspath + `/${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}.zip`,
	browserName: '',
	xcodeSigningId: 'iPhone Developer',
	clearSystemFiles: true,
	// startIWDP: true,
	fullReset: true,
	isHeadless: process.env.HEADLESS,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	bundleId: bundleId,
	newCommandTimeout: 450,
};

exports.iphoneXS14 = {
	automationName: 'XCUITest',
	platformName: 'iOS',
	platformVersion: '14.0',
	deviceName: 'iPhone XS',
	app: process.env.CI_APP === 'true' ? '' : appspath + `/${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}.zip`,
	browserName: '',
	xcodeSigningId: 'iPhone Developer',
	clearSystemFiles: true,
	// startIWDP: true,
	fullReset: true,
	isHeadless: process.env.HEADLESS,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	bundleId: bundleId,
	newCommandTimeout: 450,
};

exports.iphoneXS = {
	automationName: 'XCUITest',
	platformName: 'iOS',
	platformVersion: '13.3',
	deviceName: 'iPhone XS',
	app: process.env.CI_APP === 'true' ? '' : appspath + `/${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}.zip`,
	browserName: '',
	xcodeSigningId: 'iPhone Developer',
	clearSystemFiles: true,
	// startIWDP: true,
	fullReset: true,
	isHeadless: process.env.HEADLESS,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	bundleId: bundleId,
	newCommandTimeout: 450,
};

exports.iphoneXS2 = {
	automationName: 'XCUITest',
	platformName: 'iOS',
	platformVersion: '13.3',
	deviceName: 'iPhone XS',
	app: process.env.CI_APP === 'true' ? '' : appspath + `/${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}.zip`,
	browserName: '',
	xcodeSigningId: 'iPhone Developer',
	clearSystemFiles: true,
	// startIWDP: true,
	fullReset: true,
	isHeadless: process.env.HEADLESS,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	bundleId: bundleId,
	newCommandTimeout: 450,
};

exports.iphone7 = {
	automationName: 'XCUITest',
	platformName: 'iOS',
	platformVersion: '13.3',
	deviceName: 'iPhone 7',
	app: process.env.CI_APP === 'true' ? '' : appspath + `/${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}.zip`,
	browserName: '',
	xcodeSigningId: 'iPhone Developer',
	clearSystemFiles: true,
	fullReset: true,
	isHeadless: process.env.HEADLESS,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	bundleId: bundleId,
	newCommandTimeout: 450,
};

exports.iphone6Device = {
	automationName: 'XCUITest',
	platformName: 'iOS',
	platformVersion: '13.3',
	deviceName: 'iPhone 6',
	app: process.env.CI_APP === 'true' ? '' : appspath + `/${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}.ipa`,
	browserName: '',
	xcodeSigningId: 'iPhone Developer',
	clearSystemFiles: true,
	fullReset: true,
	isHeadless: process.env.HEADLESS,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	bundleId: bundleId,
	newCommandTimeout: 450,
};

exports.iphone11Safari = {
	automationName: 'XCUITest',
	platformName: 'iOS',
	platformVersion: '13.3',
	deviceName: 'iPhone 11',
	browserName: 'Safari',
	app: '',
	xcodeSigningId: 'iPhone Developer',
	clearSystemFiles: true,
	fullReset: true,
	autoWebview: true,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	newCommandTimeout: 450,
};

exports.pixel2Chrome = {
	automationName: 'UiAutomator2',
	platformName: 'Android',
	platformVersion: '9',
	deviceName: 'Android Emulator',
	browserName: 'Chrome',
	chromedriver_autodownload: true,
	clearSystemFiles: true,
	udid: 'emulator-5554',
	language: process.env.TRANSLATION,
	locale: getLocale(),
	fullreset: true,
	remoteAppsCacheLimit: 0,
	newCommandTimeout: 450,
};

exports.Pixel2 = {
	automationName: 'UiAutomator2',
	platformName: 'Android',
	platformVersion: '8.1',
	deviceName: 'Android Emulator',
	app: process.env.CI_APP === 'true' ? '' : appspath + `/${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}.apk`,
	browserName: '',
	clearSystemFiles: true,
	udid: 'emulator-5554',
	appActivity: `${appActivityAndroid}`,
	appPackage: `${appPackageAndroid}`,
	appWaitDuration: 60000,
	fullReset: process.env.CI_APP === 'true' ? false : true,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	uiautomator2ServerLaunchTimeout: 60000,
	uiautomator2ServerInstallTimeout: 60000,
	androidInstallTimeout: 600000,
	remoteAppsCacheLimit: 0,
	newCommandTimeout: 450,
};

exports.Pixel2XL = {
	automationName: 'UiAutomator2',
	platformName: 'Android',
	platformVersion: '8.1',
	deviceName: 'Android Emulator',
	app: process.env.CI_APP === 'true' ? '' : appspath + `/${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}.apk`,
	browserName: '',
	clearSystemFiles: true,
	udid: 'emulator-5554',
	appActivity: `${appActivityAndroid}`,
	appPackage: `${appPackageAndroid}`,
	appWaitDuration: 60000,
	fullReset: process.env.CI_APP === 'true' ? false : true,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	uiautomator2ServerLaunchTimeout: 60000,
	uiautomator2ServerInstallTimeout: 60000,
	androidInstallTimeout: 600000,
	remoteAppsCacheLimit: 0,
	newCommandTimeout: 450,
};

exports.Pixel2XL10 = {
	automationName: 'UiAutomator2',
	platformName: 'Android',
	platformVersion: '10',
	deviceName: 'Android Emulator',
	app: process.env.CI_APP === 'true' ? '' : appspath + `/${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}.apk`,
	browserName: '',
	clearSystemFiles: true,
	udid: 'emulator-5554',
	appActivity: `${appActivityAndroid}`,
	appPackage: `${appPackageAndroid}`,
	appWaitDuration: 60000,
	fullReset: process.env.CI_APP === 'true' ? false : true,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	uiautomator2ServerLaunchTimeout: 60000,
	uiautomator2ServerInstallTimeout: 60000,
	androidInstallTimeout: 600000,
	remoteAppsCacheLimit: 0,
	newCommandTimeout: 450,
};

exports.MiA3 = {
	automationName: 'UiAutomator2',
	platformName: 'Android',
	platformVersion: '10',
	deviceName: 'Android Emulator',
	app: process.env.CI_APP === 'true' ? '' : appspath + `/${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}.apk`,
	browserName: '',
	clearSystemFiles: true,
	udid: 'emulator-5554',
	appActivity: `${appActivityAndroid}`,
	appPackage: `${appPackageAndroid}`,
	appWaitDuration: 60000,
	fullReset: process.env.CI_APP === 'true' ? false : true,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	uiautomator2ServerLaunchTimeout: 60000,
	uiautomator2ServerInstallTimeout: 60000,
	androidInstallTimeout: 600000,
	remoteAppsCacheLimit: 0,
	newCommandTimeout: 450,
};

exports.MiA3_9D3 = {
	automationName: 'UiAutomator2',
	platformName: 'Android',
	platformVersion: '10',
	deviceName: 'Android Emulator',
	app: process.env.CI_APP === 'true' ? '' : appspath + `/${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}.apk`,
	browserName: '',
	clearSystemFiles: true,
	udid: '10.100.225.73:5555',
	appActivity: `${appActivityAndroid}`,
	appPackage: `${appPackageAndroid}`,
	appWaitDuration: 60000,
	fullReset: process.env.CI_APP === 'true' ? false : true,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	uiautomator2ServerLaunchTimeout: 60000,
	uiautomator2ServerInstallTimeout: 60000,
	androidInstallTimeout: 600000,
	remoteAppsCacheLimit: 0,
	newCommandTimeout: 450,
};

exports.MiA3_9D2 = {
	automationName: 'UiAutomator2',
	platformName: 'Android',
	platformVersion: '10',
	deviceName: 'Android Emulator',
	app: process.env.CI_APP === 'true' ? '' : appspath + `/${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}.apk`,
	browserName: '',
	clearSystemFiles: true,
	udid: '10.100.225.72:5555',
	appActivity: `${appActivityAndroid}`,
	appPackage: `${appPackageAndroid}`,
	appWaitDuration: 60000,
	fullReset: process.env.CI_APP === 'true' ? false : true,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	uiautomator2ServerLaunchTimeout: 60000,
	uiautomator2ServerInstallTimeout: 60000,
	androidInstallTimeout: 600000,
	remoteAppsCacheLimit: 0,
	newCommandTimeout: 450,
};

exports.MiA3_9D1 = {
	automationName: 'UiAutomator2',
	platformName: 'Android',
	platformVersion: '10',
	deviceName: 'Android Emulator',
	app: process.env.CI_APP === 'true' ? '' : appspath + `/${process.env.APP_FILE_NAME}${process.env.SERVER.toUpperCase()}${process.env.APP_VERSION}.apk`,
	browserName: '',
	clearSystemFiles: true,
	udid: '10.100.225.100:5555',
	appActivity: `${appActivityAndroid}`,
	appPackage: `${appPackageAndroid}`,
	appWaitDuration: 60000,
	fullReset: process.env.CI_APP === 'true' ? false : true,
	language: process.env.TRANSLATION,
	locale: getLocale(),
	uiautomator2ServerLaunchTimeout: 60000,
	uiautomator2ServerInstallTimeout: 60000,
	androidInstallTimeout: 600000,
	remoteAppsCacheLimit: 0,
	newCommandTimeout: 450,
};

exports.MiA3_9D1Chrome = {
	automationName: 'UiAutomator2',
	platformName: 'Android',
	platformVersion: '10',
	deviceName: 'Android Emulator',
	browserName: 'Chrome',
	chromedriver_autodownload: true,
	clearSystemFiles: true,
	udid: '10.100.225.100:5555',
	fullReset: true,
	remoteAppsCacheLimit: 0,
	newCommandTimeout: 450,
};

exports.MiA3_9D2Chrome = {
	automationName: 'UiAutomator2',
	platformName: 'Android',
	platformVersion: '10',
	deviceName: 'Android Emulator',
	browserName: 'Chrome',
	chromedriver_autodownload: true,
	clearSystemFiles: true,
	udid: '10.100.225.72:5555',
	fullReset: true,
	remoteAppsCacheLimit: 0,
	newCommandTimeout: 450,
};

exports.MiA3_9D3Chrome = {
	automationName: 'UiAutomator2',
	platformName: 'Android',
	platformVersion: '10',
	deviceName: 'Android Emulator',
	browserName: 'Chrome',
	chromedriver_autodownload: true,
	clearSystemFiles: true,
	udid: '10.100.225.73:5555',
	fullReset: true,
	remoteAppsCacheLimit: 0,
	newCommandTimeout: 450,
};
