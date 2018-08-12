const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const results = {};

module.exports = {
  readXML: function() {
    let pathFile = '';
    let currentBrowser = '';
    fs.readdirSync('./reports').forEach(file => {
      if (checkXml(file)) {
        currentBrowser = file.split('-')[0].replace('.xml', '');
        let pathFile = './reports/' + file;
        let tmp = importXml(pathFile);
        if (!results[currentBrowser]) {
          results[currentBrowser] = [];
        }
        results[currentBrowser].push(tmp);
      }
    });
    return results;
  }
};

function importXml(file) {
  let data = fs.readFileSync(file, 'utf8');
  let res = null;
  parser.parseString(data, function(err, result) {
    if (!err) res = result;
  });
  return res;
}

function checkXml(file) {
  let isXml = false;
  let ext = '';
  let stringLength = file.length;
  ext += file.charAt(stringLength - 3);
  ext += file.charAt(stringLength - 2);
  ext += file.charAt(stringLength - 1);
  if (ext === 'xml') isXml = true;
  return isXml;
}
