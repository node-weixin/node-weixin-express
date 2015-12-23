var settings = require('node-weixin-settings');

var settingsConf = {
};

function get(id, key) {
  console.log('get');

  console.log(id, key, settingsConf);
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
  console.log(id, key, value, settingsConf);
  console.log('set');

}

settings.registerSet(set);
settings.registerGet(get);
export default settings;
