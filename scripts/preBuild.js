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

function generateProdTSConfig() {
  const tsconfigSvelteJSONPath = path.join(__dirname, "..", "tsconfig.svelte.json");
  const tsconfigElectronJSONPath = path.join(__dirname, "..", "tsconfig.electron.json");

  const tsconfigSvelteJSONRaw = fs.readFileSync(tsconfigSvelteJSONPath, "utf8");
  const tsconfigSvelteJSON = JSON.parse(tsconfigSvelteJSONRaw);

  const tsconfigElectronJSONRaw = fs.readFileSync(tsconfigElectronJSONPath, "utf8");
  const tsconfigElectronJSON = JSON.parse(tsconfigElectronJSONRaw);

  tsconfigSvelteJSON.compilerOptions.sourceMap = false;
  tsconfigElectronJSON.compilerOptions.sourceMap = false;

  const newTsconfigSvelteJSONPath = tsconfigSvelteJSONPath.replace("tsconfig.svelte.json", "tsconfig.svelte.prod.json");
  const newTsconfigElectronJSONPath = tsconfigElectronJSONPath.replace(
    "tsconfig.electron.json",
    "tsconfig.electron.prod.json"
  );

  fs.writeFileSync(newTsconfigSvelteJSONPath, JSON.stringify(tsconfigSvelteJSON));
  fs.writeFileSync(newTsconfigElectronJSONPath, JSON.stringify(tsconfigElectronJSON));
}

const buildSveltePath = path.join(__dirname, "..", "public", "build");
const buildElectronPath = path.join(__dirname, "..", "build");
deleteFolderRecursive(buildSveltePath);
deleteFolderRecursive(buildElectronPath);

if (process.env.NODE_ENV === "production") {
  generateProdTSConfig();
}
// else {
//   var execSync = require("child_process").execSync;
//   var compiler = "npm run prestart:build";

//   execSync(compiler);
// }
