var todayGenerator = require('../services/getDate');
var today = todayGenerator();
today = today.replace(/\//g, '_').replace(/\:/g, '_');

module.exports = {
    "users": {
        "autobot" : {
            "name": "qa name",
            "surname" : "qa surname",
            "email" : "qa+"+today+"@example.com",
            "pass" : "qa1234"
        }
    }
}