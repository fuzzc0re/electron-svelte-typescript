const fs = require("fs");
const path = require("path");

const Terser = require("terser");
const CleanCSS = require("clean-css");
const HTMLMinifier = require("html-minifier").minify;

const minifyJSOptions = {
  mangle: {
    toplevel: true,
  },
  compress: {
    passes: 2,
  },
  output: {
    beautify: false,
    preamble: "/* uglified */",
  },
};

function getAllJSFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllJSFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles.filter((filePath) => filePath.match(/\.js$/));
}

function minifyJSFiles(filePaths) {
  filePaths.forEach(async (filePath) => {
    const unminified = fs.readFileSync(filePath, "utf8");
    const minified = await Terser.minify(unminified, minifyJSOptions);
    fs.writeFileSync(filePath, minified.code);
  });
}

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

function copyPublicFolderAndMinify(folderPath, destinationPath) {
  if (fs.existsSync(destinationPath)) deleteFolderRecursive(destinationPath);

  fs.mkdirSync(destinationPath);

  fs.readdirSync(folderPath).forEach(async (file, index) => {
    const curPath = path.join(folderPath, file);
    const newPath = path.join(destinationPath, file);
    if (fs.lstatSync(curPath).isDirectory()) {
      // recurse
      copyPublicFolderAndMinify(curPath, newPath);
    } else {
      if (curPath.match(/\.js$/)) {
        const unminified = fs.readFileSync(curPath, "utf8");
        const minified = await Terser.minify(unminified, minifyJSOptions);
        fs.writeFileSync(newPath, minified.code);
      } else if (curPath.match(/\.html$/)) {
        const unminified = fs.readFileSync(curPath, "utf8");

        const unminifiedCorrected = unminified.replace(
          '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src http://localhost:*; connect-src ws://localhost:*">',
          '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'">'
        );

        const minifierOptions = {
          preserveLineBreaks: false,
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          minifyURLs: true,
          minifyJS: true,
          minifyCSS: true,
          removeComments: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          removeEmptyElements: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          quoteCharacter: "'",
        };
        const minified = HTMLMinifier(unminifiedCorrected, minifierOptions);
        fs.writeFileSync(newPath, minified);
      } else if (curPath.match(/\.css$/)) {
        const unminified = fs.readFileSync(curPath, "utf8");
        const minified = new CleanCSS().minify(unminified);
        fs.writeFileSync(newPath, minified.styles);
      } else if (curPath.match(/\.png$/)) {
        const pngFile = fs.readFileSync(curPath);
        fs.writeFileSync(newPath, pngFile);
      }
    }
  });
}

function cleanTsconfig() {
  const tsconfigSvelteJSONPath = path.join(__dirname, "..", "tsconfig.svelte.prod.json");
  const tsconfigElectronJSONPath = path.join(__dirname, "..", "tsconfig.electron.prod.json");

  if (fs.existsSync(tsconfigSvelteJSONPath)) fs.unlinkSync(tsconfigSvelteJSONPath);
  if (fs.existsSync(tsconfigElectronJSONPath)) fs.unlinkSync(tsconfigElectronJSONPath);
}

const bundledElectronPath = path.join(__dirname, "..", "build");

const jsFiles = getAllJSFiles(bundledElectronPath);
minifyJSFiles(jsFiles);

copyPublicFolderAndMinify(path.join(__dirname, "..", "public"), path.join(bundledElectronPath, "public"));
cleanTsconfig();
