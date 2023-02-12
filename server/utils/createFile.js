const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

module.exports = function createFile(file) {
  const fileName = `${uuidv4()}${file.originalFilename}`;
  const oldPath = file.filepath;
  const newPath = `${__dirname}/../images/${fileName}`;

  fs.renameSync(oldPath, newPath);

  return fileName;
};
