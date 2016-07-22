#!/usr/bin/env node
'use strict';
var meow = require('meow');
var path = require('path');
var yaml = require('yamljs');
var validator = require('node-form-validator');
var assert = require('assert');
var server = require('./server');

var cli = meow([
  'Usage',
  '  $ weixin [--yaml yaml-file]',
  '',
  '',
  'Examples',
  '  $ weixin config.yaml'
]);

var dir = path.resolve(__filename);
var configFile;
if (cli.flags.yaml) {
  configFile = path.resolve(cli.flags.yaml);
} else {
  configFile = path.resolve(path.dirname(dir), 'config.yaml');
}

var config = yaml.load(configFile);
var validations = require('./validations/config');

var error = validator.validate(config, validations);
if (error.code) {
  console.error(JSON.stringify(error));
}
assert(error.code === 0);

server(error.data, function (app) {
  app.get('/', function (req, res) {
    res.send('Hello world!');
  });
  console.log(app._router.stack);
  app.listen(config.port, config.host, function () {
    console.log('Server listening on port', config.port);
    console.log('Visit http://' + config.host + ':' + config.port);
  });
});
