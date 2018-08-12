const html = require('./html');
const { readXML } = require('../xml');
const results = {};

module.exports = {
  generateReport: function() {
    return new Promise(resolve => {
      let pathFile = '';
      results = readXML();
      html.exportHTML(results).then(pathHtml => {
        pathFile = pathHtml;
        resolve(pathFile);
      });
    });
  }
};
