const { readdirSync, readFileSync, writeFileSync, existsSync, lstatSync, unlinkSync, rmdirSync } = require("fs");
const { join } = require("path");

const deleteFolderRecursive = (folderPath) => {
  if (existsSync(folderPath)) {
    readdirSync(folderPath).forEach((file) => {
      const curPath = join(folderPath, file);
      if (lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        unlinkSync(curPath);
      }
    });
    rmdirSync(folderPath);
  }
};

const fixElectronTsconfig = () => {
  const tsconfigElectronJSONPath = join(__dirname, "..", "src", "electron", "tsconfig.json");
  const tsconfigElectronJSONRaw = readFileSync(tsconfigElectronJSONPath, "utf8");
  const tsconfigElectronJSON = JSON.parse(tsconfigElectronJSONRaw); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  tsconfigElectronJSON.compilerOptions.outDir = "build";
};

const generateProdTSConfig = () => {
  const tsconfigSvelteJSONPath = join(__dirname, "..", "src", "frontend", "tsconfig.json");
  const tsconfigElectronJSONPath = join(__dirname, "..", "src", "electron", "tsconfig.json");

  const tsconfigSvelteJSONRaw = readFileSync(tsconfigSvelteJSONPath, "utf8");
  const tsconfigSvelteJSON = JSON.parse(tsconfigSvelteJSONRaw); // eslint-disable-line @typescript-eslint/no-unsafe-assignment

  const tsconfigElectronJSONRaw = readFileSync(tsconfigElectronJSONPath, "utf8");
  const tsconfigElectronJSON = JSON.parse(tsconfigElectronJSONRaw); // eslint-disable-line @typescript-eslint/no-unsafe-assignment

  tsconfigSvelteJSON.compilerOptions.sourceMap = false;
  tsconfigSvelteJSON.include = [join(__dirname, "..", "src", "frontend")];
  tsconfigElectronJSON.compilerOptions.sourceMap = false;
  tsconfigElectronJSON.compilerOptions.outDir = "build";
  tsconfigElectronJSON.include = [join(__dirname, "..", "src", "electron")];

  const newTsconfigSvelteJSONPath = join(__dirname, "..", "tsconfig.svelte.prod.json");
  const newTsconfigElectronJSONPath = join(__dirname, "..", "tsconfig.electron.prod.json");

  writeFileSync(newTsconfigSvelteJSONPath, JSON.stringify(tsconfigSvelteJSON));
  writeFileSync(newTsconfigElectronJSONPath, JSON.stringify(tsconfigElectronJSON));
};

const buildSveltePath = join(__dirname, "..", "public", "build");
const buildElectronPath = join(__dirname, "..", "build");
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
