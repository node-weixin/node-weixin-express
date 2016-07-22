var yaml = require('yamljs');
var validator = require('node-form-validator');
var assert = require('assert');

module.exports = function (configFile) {
  var config = yaml.load(configFile);
  var validations = require('./validations/config');

  var error = validator.validate(config, validations);
  if (error.code) {
    throw new Error(JSON.stringify(error));
  }
  assert(error.code === 0);
  return error.data;
};
