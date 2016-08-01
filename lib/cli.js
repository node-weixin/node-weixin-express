#!/usr/bin/env node
'use strict';

var meow = require('meow');
var path = require('path');
var assert = require('assert');
var fs = require('fs');
var validator = require('node-form-validator');

var server = require('./server');
var parser = require('./parser');
var router = require('./router');
var waterline = require('./waterline');

var localTunnel = require('./localtunnel');

var cli = meow([
  'Usage',
  '  $ weixin [--yaml] yaml-file',
  '',
  '',
  'Examples',
  '  $ weixin --yaml config.yaml',
  '  $ weixin config.yaml'
]);

var config;
var dbConfig;

var yamlFile = cli.flags.yaml || cli.input[0];
if (yamlFile) {
  assert(yamlFile);
  var configFile;

  configFile = path.resolve(yamlFile);
  if (!fs.existsSync(configFile)) {
    console.error('YAML 文件不存在！');
    throw new Error('YAML 文件不存在！');
  }
  assert(fs.existsSync(configFile));
  config = parser(configFile);
} else {
  config = require('./config/default');
}

var validations = require('./validations/config');

var error = validator.validate(config, validations);
if (error.code) {
  throw new Error(error.message);
}
config = error.data;

dbConfig = require('./config/database');

function info(data, name) {
  if (data) {
    console.info(name + ' initialized');
  } else {
    console.info(name + ' not initialized');
  }
}
var dataTypes = ['port', 'host', 'server', 'template', 'message', 'app', 'merchant', 'oauth', 'cerfiticated'];
for (var i = 0; i < dataTypes.length; i++) {
  var k = dataTypes[i];
  info(config[k], k);
}

var running = false;

function onListenEnd() {
  console.info('Server listening on port', config.port);
  console.info('Your local address is http://' + config.host + ':' + config.port);
  localTunnel(config, config.localtunnel);
}

function callback(app, weixin, models) {
  if (running) {
    return;
  }
  running = true;
  weixin.init(config, models);

  router(app, config.weixin);
  app.listen(config.port, config.host, onListenEnd);
}

server(function (app, weixin) {
  waterline.init(dbConfig, function (error, ontology) {
    var models = ontology.connections;
    console.log(error, models);
    callback(app, weixin, models);
  });
}, config.weixin, config.weixin.server.prefix);

module.exports = {
  callback: callback,
  onListenEnd: onListenEnd
};
