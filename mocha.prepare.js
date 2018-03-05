var prepare = require('mocha-prepare');
var removeFiles = require('./services/removeFiles');
var { generateReport } = require('./services/reporter/reporter');
var { sendMailTest } = require('./services/nodemailer');
//Make test hooks are executed before and after of all execution, for hooks of each test, you should go to helpers/setup 
prepare(function (done) {
    // called before loading of test cases 
    return new Promise(resolve => {
        removeFiles('./reports');
        console.log('Start execution on: ' + process.env.DEVICE);
        console.log('OS: ' + process.env.OS);
        console.log('Jira issues creation set to: ' + process.env.JIRA_ISSUE_CREATION);
        console.log('Mail sender set to: ' + process.env.MAIL_SEND);
        done();
        resolve();
    });
}, function (done) {
    // called after all test completes (regardless of errors) 
    return new Promise((resolve, reject) => {
        generateReport()
            .then((pathFile) => sendMailTest(pathFile))
            .then(() =>{
                done();
                resolve();
            }).catch(err => {
                console.log(err);
                done();
                reject(err);
            });
    });
});
