var localtunnel = require('localtunnel');
var open = require('open');
var shared = require('./shared');

var tunnel = {
  start: function (config, options) {
    var t = localtunnel(config.port, options, tunnel.connected(config));
    t.on('close', tunnel.close);
  },
  close: function () {
    // tunnels are closed
    console.log('tunnels are closed');
  },
  connected: function (config) {
    return function (err, t) {
      if (err) {
        console.log('fail to create tunnel');
      }
      console.log('Succeeded to create tunnel');
      console.log('Your tunnel url is ' + t.url);
      shared.url = t.url;
      if (config.open) {
        open(t.url);
      }
    };
  },
  error: function (config, options) {
    return function (err) {
      // handle the error safely
      if (String(err).indexOf('localtunnel.me') !== -1) {
        tunnel.start(config, options);
      }
    };
  }
};

module.exports = function (config, options) {
  tunnel.start(config, options);
  process.on('uncaughtException', tunnel.error(config, options));
};

module.exports._tunnel = tunnel;
