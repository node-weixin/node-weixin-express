#!/usr/bin/env node
'use strict';

var meow = require('meow');
var path = require('path');
var assert = require('assert');
var fs = require('fs');

var server = require('./server');
var parser = require('./parser');
var router = require('./router');
var htmlTemplate = require('./template');

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

var configFile;
var yamlFile = cli.flags.yaml || cli.input[0];
if (!yamlFile) {
  console.error('YAML 文件未指定！');
  throw new Error('YAML 文件未指定！');
}
assert(yamlFile);
configFile = path.resolve(yamlFile);
if (!fs.existsSync(configFile)) {
  console.error('YAML 文件不存在！');
  throw new Error('YAML 文件不存在！');
}
assert(fs.existsSync(configFile));

var config = parser(configFile);

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

function parseMessage(message, type, handler) {
  var func = handler[type];
  if (typeof func === 'function') {
    func(message);
  } else {
    console.error(type + ' Not Found!');
  }
}

function onAuthEvent(message) {
  console.info('on Auth Event');
  console.log(message);
  var handler = require('./auth/events');
  parseMessage(message, message.Event.toLowerCase(), handler);
}

function onAuthMessage(message) {
  console.info('on Auth Message');
  console.log(message);
  var handler = require('./auth/message');
  parseMessage(message, message.MsgType.toLowerCase(), handler);
}

function onOAuthAccess() {
  console.info('on OAuth access');
}

function onOAuthSuccess(req, res, data) {
  console.info('on OAuth Success');
  var template = htmlTemplate(config);
  var html = template.render('oauth.html', data);
  res.send(html);
}

function onListenEnd() {
  console.info('Server listening on port', config.port);
  console.info('Your local address is http://' + config.host + ':' + config.port);
  localTunnel(config, config.localtunnel);
}

function callback(app, weixin) {
  if (running) {
    return;
  }
  running = true;
  weixin.onAuthEvent(onAuthEvent);
  weixin.onAuthMessage(onAuthMessage);
  weixin.onOauthAccess(onOAuthAccess);
  weixin.onOauthSuccess(onOAuthSuccess);
  router(app, config.weixin);
  app.listen(config.port, config.host, onListenEnd);
}

server(callback, config.weixin, config.weixin.server.prefix);

module.exports = {
  callback: callback,
  auth: {
    event: onAuthEvent,
    message: onAuthMessage
  },
  oauth: {
    access: onOAuthAccess,
    success: onOAuthSuccess
  },
  onListenEnd: onListenEnd
};
