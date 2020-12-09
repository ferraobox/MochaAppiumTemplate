const moment = require('moment');
module.exports = exdate => {
	let date = moment().subtract(18, 'years');
	let date2 = moment()
		.subtract(1, 'days')
		.subtract(18, 'years');
	date = process.env.DEVICE === 'iphone6Device' ? date.format('DD/MM/YY') : process.env.DEVICE.search('Pixel2') >= 0 ? date.format('YYYY-MM-DD') : date.format('DD.MM.YYYY');
	//date = process.env.DEVICE === 'iphone6Device' ? date.format('YYYY-MM-DD') : process.env.DEVICE.search('Pixel2') >= 0 ? date.format('YYYY-MM-DD') : date.format('YYYY-MM-DD');
	date2 = process.env.DEVICE === 'iphone6Device' ? date2.format('DD/MM/YY') : process.env.DEVICE.search('Pixel2') >= 0 ? date2.format('YYYY-MM-DD') : date2.format('DD.MM.YYYY');
	//date2 = process.env.DEVICE === 'iphone6Device' ? date2.format('YYYY-MM-DD') : process.env.DEVICE.search('Pixel2') >= 0 ? date2.format('YYYY-MM-DD') : date2.format('YYYY-MM-DD');
	return exdate === date || exdate === date2;
};
