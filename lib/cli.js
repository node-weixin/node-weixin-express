#!/usr/bin/env node
'use strict';
var meow = require('meow');
var path = require('path');
var assert = require('assert');
var fs = require('fs');

var server = require('./server');
var parser = require('./parser');

var cli = meow([
  'Usage',
  '  $ weixin [--yaml yaml-file]',
  '',
  '',
  'Examples',
  '  $ weixin config.yaml'
]);

var configFile;
assert(cli.flags.yaml);
configFile = path.resolve(cli.flags.yaml);
assert(fs.existsSync(configFile));

var config = parser(configFile);

server(config, function (app, weixin) {
  app.get('/', function (req, res) {
    res.send('Hello world!');
  });
  weixin.onAuthEvent(function () {
    console.log('on Auth Event');
    console.log(arguments);
  });
  weixin.onAuthMessage(function () {
    console.log('on Auth Message');
    console.log(arguments);
  });
  console.log(app._router.stack);
  app.listen(config.port, config.host, function () {
    console.log('Server listening on port', config.port);
    console.log('Visit http://' + config.host + ':' + config.port);
  });
});
