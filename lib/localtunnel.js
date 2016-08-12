var localtunnel = require('localtunnel');
var open = require('open');
var shared = require('./shared');

var tunnel = {
  _status: 'stopped',
  _t: null,
  _config: null,
  _options: null,
  _cb: null,
  start: function (config, options, cb) {
    if (tunnel._status !== 'stopped') {
      return;
    }
    tunnel._status = 'starting';
    var t = localtunnel(config.port, options, tunnel.connected(config, cb));
    t.on('close', tunnel.close);
    tunnel._t = t;
    tunnel._options = options;
    tunnel._cb = cb;
  },
  close: function () {
    // tunnels are closed
    console.log('Tunnels are closed');
  },
  connected: function (config, cb) {
    return function (err, t) {
      if (err) {
        console.log('Fail to create a tunnel');
      }
      console.log('Succeeded creating a tunnel');
      console.log('Your tunnel url is ' + t.url);
      shared.url = t.url;
      if (config.open) {
        open(t.url);
      }
      if (cb) {
        cb(t.url);
      }
      tunnel._status = 'started';
    };
  },
  restart: function () {
    tunnel.start(tunnel._config, tunnel._options, tunnel._cb);
  },
  error: function () {
    return function (err) {
      // handle the error safely
      tunnel._status = 'stopped';
      if (String(err).indexOf('localtunnel.me') !== -1) {
        tunnel._t.close();
        setTimeout(tunnel.restart, 1000);
      }
    };
  }
};

module.exports = function (config, options, cb) {
  tunnel.start(config, options, cb);
  process.on('uncaughtException', tunnel.error());
};

module.exports._tunnel = tunnel;
