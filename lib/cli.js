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
    console.log(name + ' initialized');
  } else {
    console.log(name + ' not initialized');
  }
}
console.log(config);
var dataTypes = ['port', 'host', 'server', 'template', 'message', 'app', 'merchant', 'oauth', 'cerfiticated'];
for (var i = 0; i < dataTypes.length; i++) {
  var k = dataTypes[i];
  info(config[k], k);
}

var running = false;

function onAuthEvent() {
  console.log('on Auth Event');
  console.log(arguments);
}

function onAuthMessage() {
  console.log('on Auth Message');
  console.log(arguments);
}

function onOAuthAccess() {
  console.log('on OAuth access');
  console.log(arguments);
}


function onOAuthSucces(req, res, data) {
  console.log('on OAuth Success');
  console.log(data);
  var template = htmlTemplate(config);
  var html = template.render('oauth.html', data);
  res.send(html);
}

function onListenEnd() {
  console.log('Server listening on port', config.port);
  console.log('Visit http://' + config.host + ':' + config.port);
}

function callback(app, weixin) {
  if (running) {
    return;
  }
  running = true;
  weixin.onAuthEvent(onAuthEvent);
  weixin.onAuthMessage(onAuthMessage);
  weixin.onOauthAccess(onOAuthAccess);
  weixin.onOauthSuccess(onOAuthSucces);
  router(app, config);
  app.listen(config.port, config.host, onListenEnd);
}

server(callback, config, config.server.prefix);

module.exports = {
  callback: callback,
  auth: {
    event: onAuthEvent,
    message: onAuthMessage
  },
  onListenEnd: onListenEnd
};
