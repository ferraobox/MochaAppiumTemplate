var resemble = require('node-resemble-js');

module.exports = function (backgroundBefore, backgroundAfter, cb) {
  resemble(backgroundBefore)
    .compareTo(backgroundAfter)
    .ignoreColors()
    .onComplete(function (data) {
      cb(data);
    });
};
