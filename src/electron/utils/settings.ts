import ElectronStore = require("electron-store");

interface ISettings {
  check: boolean;
}

const settings = new ElectronStore<ISettings>({
  defaults: {
    check: false,
  },
});

export default settings;
