const fs = require("fs");
const path = require("path");

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file, index) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

const buildSveltePath = path.join(__dirname, "..", "public", "build");
const buildElectronPath = path.join(__dirname, "..", "build");
deleteFolderRecursive(buildSveltePath);
deleteFolderRecursive(buildElectronPath);
