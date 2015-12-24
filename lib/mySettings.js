var settings = require('node-weixin-settings');

var settingsConf = {
};

function get(id, key) {
  if (settingsConf[id] && settingsConf[id][key]) {
    return settingsConf[id][key];
  }
  return null;
}

function set(id, key, value) {
  if (!settingsConf[id]) {
    settingsConf[id] = {};
  }
  settingsConf[id][key] = value;
}

settings.registerSet(set);
settings.registerGet(get);
export default settings;
