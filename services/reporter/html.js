const fs = require('fs');
const handlebars = require('handlebars');
const todayGenerator = require('../getDate');
const today = todayGenerator();

module.exports = {
  exportHTML: function(resultsTest) {
    return new Promise((resolve, reject) => {
      var pathHtml = '';
      createTables(resultsTest)
        .then(tablesHTML => writeHTML(tablesHTML))
        .then(msg => {
          pathHtml = msg;
          resolve(pathHtml);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
};

function createTables(resultsTest) {
  return new Promise(resolve => {
    var tablesHTML = [];
    for (key in resultsTest) {
      resultsTest[key].forEach(element => {
        var testresults = element.testsuites.testsuite;
        var table = `<h2>` + key + `</h2><table id="table_test"><tr><th> Type </th><th> Description </th><th> Result </th><th> Time </th></tr>`;
        tablesHTML.push(printTable(table, testresults));
      });
    }
    resolve(tablesHTML);
  });
}

function printTable(table, testresults) {
  let countTest = 1;
  testresults.forEach(element => {
    if (element.testcase) {
      var test = {
        steps: element.testcase,
        testcaseName: element.$.name,
        failures: element.$.failures,
        numberoftest: element.$.tests
      };
      table += iterateTree(test, countTest);
      countTest++;
    }
  });
  table += `</table>`;
  return table;
}

function writeHTML(tables) {
  var reportFilename = 'TestResults-' + today.replace(/\//g, '_').replace(/\:/g, '_') + '.html';
  var reportFilePath = './reports/' + reportFilename;

  return new Promise((resolve, reject) => {
    // read the html template
    fs.readFile('./services/reporter/html-reporter.hbs', function(err, data) {
      if (err) reject(err);

      var template = data.toString();
      // merge the template with the test results data
      var html = handlebars.compile(template)({
        tables: tables,
        timestamp: today,
        oneversion: process.env.ONE_VERSION
      });

      // write the html to a file
      fs.writeFile(reportFilePath, html, function(err) {
        if (err) throw err;
        resolve(reportFilePath);
      });
    });
  });
}

function iterateTree(test, countTest) {
  let line = '';
  if (test.failures > 0) {
    line += `<tr><td class="fail"> <strong> ** Test </strong> </td><td class="fail"> <strong> ${test.testcaseName} </strong> </td><td class="fail"> <strong> Failed </strong> </td><td class="fail"> - ${countTest} - </td></tr>`;
  } else {
    line += `<tr><td class="test"> <strong> Test </strong> </td><td class="test"> <strong> ${test.testcaseName} </strong> </td><td class="test"> <strong> Passed </strong> </td><td class="test"> - ${countTest} - </td></tr>`;
  }
  test.steps.forEach(step => {
    const row = step.$;
    if ('failure' in step) {
      line += `<tr><td class="fail"> * Step </td><td class="fail">${row.classname}</td><td class="fail"> Failed </td><td class="fail">${row.time}</td></tr>`;
      line += `<tr><td class="fail detail" colspan="4"> ${step.failure} </td></tr>`;
    } else {
      line += `<tr><td class="pass"> Step </td><td class="pass">${row.classname}</td><td class="pass"> Passed </td><td class="pass">${row.time}</td></tr>`;
    }
  });
  return line;
}
