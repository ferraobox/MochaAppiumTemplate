const os = process.env.OS === 'iOS' ? 'i' : 'a';
const todayGenerator = require('../services/getDate');

module.exports = function dataGenerator(pay) {
  let _pay = pay || '';
  let today = todayGenerator();
  today = today.replace(/\//g, '_').replace(/\:/g, '_');
  today = today.replace('_18', '');
  let data = {
    users: {
      autobot: {
        name: 'qa name',
        surname: 'qa surname',
        email: 'qa+' + os + today + _pay + '@test.com',
        pass: 'demo1234'
      }
    }
  };
  return data;
};
