const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

module.exports = function createFile(file) {
  const oldPath = file.filepath;
  const newPath = `${__dirname}/../images/${uuidv4()}${file.originalFilename}`;

  fs.renameSync(oldPath, newPath);
};
