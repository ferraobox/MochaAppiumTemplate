const fs = require('fs');
module.exports = function removeScreenShots() {
  try {
    let files = fs.readdirSync('./images');
  } catch (e) {
    return;
  }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      let filePath = './images/' + files[i];
      let device = process.env.DEVICE;
      let checkDevice = filePath.slice(filePath.length - (4 + device.length), filePath.length - 4) === device ? true : false;
      if (fs.statSync(filePath).isFile() && checkDevice === true) fs.unlinkSync(filePath);
    }
};
