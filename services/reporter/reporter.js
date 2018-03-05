var html = require('./html');
var fs = require('fs');
var { readXML } = require('../xml');
var results = {};

module.exports = {

    generateReport: function () {
        return new Promise(resolve => {
            var pathFile = '';
            results = readXML();
            html.exportHTML(results)
                .then(pathHtml => {
                    pathFile = pathHtml;
                    resolve(pathFile);
                });
        });
    }
};
