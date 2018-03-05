var fs = require('fs');
var handlebars = require('handlebars');
var todayGenerator = require('../getDate');
var today = todayGenerator();

module.exports = {

  exportHTML: function (resultsTest) {
    return new Promise((resolve, reject) => {
      var pathHtml = '';
      createTables(resultsTest)
        .then(tablesHTML => writeHTML(tablesHTML))
        .then(msg => {
          pathHtml = msg;
          resolve(pathHtml);
        }).catch(err => {
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
  testresults.forEach(element => {

    if(element.testcase){
      var test = {
        steps: element.testcase,
        testcaseName: element.$.name,
        failures: element.$.failures,
        numberoftest: element.$.tests
      }
       table += iterateTree(test);
    }
  });
  table += `</table>`;
  return table;
}

function writeHTML(tables) {
  var reportFilename = 'ONE-TestResults-' + today.replace(/\//g, '_').replace(/\:/g, '_') + '.html';
  var reportFilePath = './reports/' + reportFilename;

  return new Promise((resolve, reject) => {
    // read the html template
    fs.readFile('./services/reporter/html-reporter.hbs', function (err, data) {
      if (err) reject(err);

      var template = data.toString();
      // merge the template with the test results data
      var html = handlebars.compile(template)({
        tables: tables,
        timestamp: today
      });

      // write the html to a file
      fs.writeFile(reportFilePath, html, function (err) {
        if (err) throw err;
        resolve(reportFilePath);
      });
    });
  });
}

function iterateTree(test) {
  let line = '';
  
  if (test.failures > 0) {
    line += `<tr><td class="fail"> <strong> ** Test </strong> </td><td class="fail"> <strong> ${test.testcaseName} </strong> </td><td class="fail"> <strong> Failed </strong> </td><td class="fail"> - </td></tr>`;
  } else {
    line += `<tr><td class="test"> <strong> Test </strong> </td><td class="test"> <strong> ${test.testcaseName} </strong> </td><td class="test"> <strong> Passed </strong> </td><td class="test"> - </td></tr>`;
  }
  test.steps.forEach(step => {
    const row = step.$;
    if ('failure' in step) {
      line += `<tr><td class="fail"> * Step </td><td class="fail">${row.classname}</td><td class="fail"> Failed </td><td class="fail">${row.time}</td></tr>`;
      line += `<tr><td class="fail detail" colspan="4"> ${step.failure} </td></tr>`

    } else {
      line += `<tr><td class="pass"> Step </td><td class="pass">${row.classname}</td><td class="pass"> Passed </td><td class="pass">${row.time}</td></tr>`;
    }
  });
  return line;
}
