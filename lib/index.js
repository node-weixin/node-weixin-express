'use strict';
var server = require('./server');

var router = require('./router');
var waterline = require('./waterline');

var weixinCallback = require('./weixin/callback');

var localTunnel = require('./localtunnel');

var dbConfig = require('./config/database');

var running = false;

var index = {
  _config: null,
  _app: null,
  _weixin: null,
  _models: null,
  _info: function info(data, name) {
    if (data) {
      console.info(name + ' initialized');
    } else {
      console.info(name + ' not initialized');
    }
  },
  info: function (config) {
    var dataTypes = ['port', 'host', 'server', 'template', 'message', 'app', 'merchant', 'oauth', 'cerfiticated'];
    for (var i = 0; i < dataTypes.length; i++) {
      var k = dataTypes[i];
      index._info(config[k], k);
    }
  },
  init: function (config, cb) {
    index._config = config;
    index.info(config);
    index.server(config, cb);
  },
  server: function (config, cb) {
    server(index.onServerUp(cb), config.weixin, config.weixin.server.prefix);
  },
  onServerUp: function (cb) {
    return function (app, weixin) {
      index._app = app;
      index._weixin = weixin;
      waterline.init(dbConfig, index.onOrmReady(app, weixin, cb));
    };
  },
  onOrmReady: function (app, weixin, cb) {
    return function (error, ontology) {
      var models = ontology.collections;
      index._models = models;
      index.callback(app, weixin, models, cb);
    };
  },
  callback: function (app, weixin, models, cb) {
    var config = index._config;
    if (running) {
      return;
    }
    running = true;
    weixinCallback.init(config, models, weixin);

    router(app, config.template);
    app.listen(config.port, config.host, index.onListenEnd(cb));
  },
  onListenEnd: function (cb) {
    var config = index._config;
    console.info('Server listening on port', config.port);
    console.info('Your local address is http://' + config.host + ':' + config.port);
    localTunnel(config, config.localtunnel, cb);
    index._tunnel = localTunnel;
  }
};
module.exports = index;
