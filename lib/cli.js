#!/usr/bin/env node
'use strict';

var meow = require('meow');
var path = require('path');
var assert = require('assert');
var fs = require('fs');
var validator = require('node-form-validator');

var parser = require('./parser');
var server = require('./index');

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
var callback = {
  onSuccess: function () {
  }
};
server.init(config, function () {
  callback.onSuccess();
});
module.exports = callback;
