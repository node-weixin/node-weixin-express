var localtunnel = require('localtunnel');
var open = require('open');
var shared = require('./shared');

var tunnel = {
  start: function (config, options, cb) {
    var t = localtunnel(config.port, options, tunnel.connected(config, cb));
    t.on('close', tunnel.close);
  },
  close: function () {
    // tunnels are closed
    console.log('tunnels are closed');
  },
  connected: function (config, cb) {
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
      if (cb) {
        cb();
      }
    };
  },
  error: function (config, options, cb) {
    return function (err) {
      // handle the error safely
      if (String(err).indexOf('localtunnel.me') !== -1) {
        tunnel.start(config, options, cb);
      }
    };
  }
};

module.exports = function (config, options, cb) {
  tunnel.start(config, options, cb);
  process.on('uncaughtException', tunnel.error(config, options, cb));
};

module.exports._tunnel = tunnel;
