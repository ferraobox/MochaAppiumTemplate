const fs = require('fs');
module.exports = function removeFiles(dirPath) {
  try {
    let files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  if (files.length > 0)
    for (let i = 0; i < files.length; i++) {
      let filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
      else rmDir(filePath);
    }
  //remove directory
  //fs.rmdirSync(dirPath);
};
