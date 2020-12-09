const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const todayGenerator = require('../getDate');
const today = todayGenerator();
let passedCount = 0;
let failedCount = 0;
const warnCount = 0;
let totalCount = 0;

module.exports = {
	exportHTML: function (resultsTest) {
		return new Promise((resolve, reject) => {
			let pathHtml = '';
			createTables(resultsTest)
				.then((tablesHTML) => writeHTML(tablesHTML))
				.then((msg) => {
					pathHtml = msg;
					resolve(pathHtml);
				})
				.catch((err) => {
					console.log(err);
					reject(err);
				});
		});
	},
};

function createTables(resultsTest) {
	return new Promise((resolve) => {
		const tablesHTML = [];
		for (const key in resultsTest) {
			resultsTest[key].forEach((element) => {
				const testresults = element.testsuites.testsuite;
				const table = `<h2> <strong>* ${process.env.OS}:</strong> ${key}</h2><table id="table_test"><tr><th> Type </th><th> Description </th><th> Result </th><th> Time </th></tr>`;
				tablesHTML.push(printTable(table, testresults));
			});
		}
		resolve(tablesHTML);
	});
}

function printTable(table, testresults) {
	let countTest = 1;
	testresults.forEach((element) => {
		if (element.testcase) {
			const test = {
				steps: element.testcase,
				testcaseName: element.$.name,
				failures: element.$.failures,
				numberoftest: element.$.tests,
			};
			table += iterateTree(test, countTest);
			countTest++;
		}
	});
	table += '</table>';
	return table;
}

function writeHTML(tables) {
	const reporterTemplateHtml = path.join(__dirname, '/html-reporter.hbs');
	const reportFilename = `testResults-${process.env.APP_NAME.toUpperCase()}-${process.env.SERVER}-${today.replace(/\//g, '_').replace(/:/g, '_')}.html`;
	const reportFilePath = `${process.env.PWD}/reports/${reportFilename}`;

	return new Promise((resolve, reject) => {
		// read the html template
		fs.readFile(reporterTemplateHtml, function (err, data) {
			if (err) reject(err);

			const passedPercentage = (passedCount * 100) / totalCount;
			const failPercentage = (failedCount * 100) / totalCount;
			const warnPercentage = (warnCount * 100) / totalCount;
			const passedPercentageConfg = getDegrees(passedPercentage, 'green');
			const failPercentageConfg = getDegrees(failPercentage, 'red');
			const warnPercentageConfg = getDegrees(warnPercentage, 'orange');

			const versionserver = `${process.env.APP_VERSION} - ${process.env.SERVER.toUpperCase()}`;
			const template = data.toString();
			// merge the template with the test results data
			const html = handlebars.compile(template)({
				tables: tables,
				timestamp: today,
				version: versionserver,
				passedPercentage: passedPercentage.toFixed(0),
				failPercentage: failPercentage.toFixed(0),
				warnPercentage: warnPercentage.toFixed(0),
				passedPercentageConfg: passedPercentageConfg,
				failPercentageConfg: failPercentageConfg,
				warnPercentageConfg: warnPercentageConfg,
				team: process.env.APP_NAME,
			});

			// write the html to a file
			fs.writeFile(reportFilePath, html, function (err) {
				if (err) throw err;
				resolve(reportFilePath);
			});
		});
	});
}

function iterateTree(test, countTest) {
	let line = '';
	totalCount++;
	if (test.failures > 0) {
		failedCount++;
		line += `<tr><td class="test-fail"> <strong> ** Test </strong> </td><td class="test-fail"> <strong> ${test.testcaseName} </strong> </td><td class="test-fail"> <strong> Failed </strong> </td><td class="test-fail"> - ${countTest} - </td></tr>`;
	} else {
		passedCount++;
		line += `<tr><td class="test"> <strong> Test </strong> </td><td class="test"> <strong> ${test.testcaseName} </strong> </td><td class="test"> <strong> Passed </strong> </td><td class="test"> - ${countTest} - </td></tr>`;
	}
	test.steps.forEach((step) => {
		const row = step.$;
		if ('failure' in step) {
			line += `<tr><td class="fail"> * Step </td><td class="fail">${row.classname}</td><td class="fail"> Failed </td><td class="fail">${row.time}</td></tr>`;
			line += `<tr><td class="fail detail" colspan="4"> ${JSON.stringify(step.failure, null, 4)} </td></tr>`;
		} else {
			line += `<tr><td class="pass"> Step </td><td class="pass">${row.classname}</td><td class="pass"> Passed </td><td class="pass">${row.time}</td></tr>`;
		}
	});
	return line;
}

function getDegrees(perc, color) {
	let degrees = (360 * perc) / 100;
	if (degrees <= 180) {
		degrees = degrees + 90;
		return `linear-gradient(${degrees.toFixed(0)}deg, transparent 50%, grey 50%),
		linear-gradient(90deg, grey 50%, transparent 50%)`;
	} else {
		degrees = degrees - 90;
		return `linear-gradient(${degrees.toFixed(0)}deg, transparent 50%, ${color} 50%),
		linear-gradient(90deg, grey 50%, transparent 50%)`;
	}
}
