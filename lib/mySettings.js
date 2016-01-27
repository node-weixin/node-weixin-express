var settings = require('node-weixin-settings');

var settingsConf = {
};

function get(id, key, next) {
  if (!next instanceof Function) {
    throw new Error();
  }
  if (settingsConf[id] && settingsConf[id][key]) {
    return next(settingsConf[id][key]);
  }
  return next(null);
}

function set(id, key, value, next) {
  if (!next instanceof Function) {
    throw new Error();
  }
  if (!settingsConf[id]) {
    settingsConf[id] = {};
  }
  settingsConf[id][key] = value;
  next();
}

function all(id, next) {
  if (!next instanceof Function) {
    throw new Error();
  }
  if (!settingsConf[id]) {
    settingsConf[id] = {};
  }
  next(settingsConf[id]);
}

settings.registerSet(set);
settings.registerGet(get);
settings.registerAll(all);
export default settings;
