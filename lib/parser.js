var yaml = require('yamljs');
var validator = require('node-form-validator');
var assert = require('assert');

function getUrls(host, prefix, proto) {
  var baseUrl = proto + '://' + host + '/';
  if (prefix) {
    assert(prefix[0] === '/');
    prefix += '/';
  }
  return {
    auth: {
      ack: baseUrl + prefix + 'auth/ack'
    },
    jssdk: {
      config: baseUrl + prefix + 'jssdk/config',
      main: baseUrl + 'pages/jssdk'
    },
    oauth: {
      access: baseUrl + prefix + 'oauth/access',
      success: baseUrl + prefix + 'oauth/success',
      redirect: baseUrl + 'pages/oauth'
    },
    pay: {
      callback: baseUrl + prefix + 'pay/callback',
      success: baseUrl + 'pages/pay',
      main: baseUrl + 'pages/pay',
      error: baseUrl + 'error/pay',
      redirect: baseUrl + 'pages/pay'
    }
  };
}

module.exports = function (configFile) {
  var config = yaml.load(configFile);
  var validations = require('./validations/config');

  var error = validator.validate(config, validations);
  if (error.code) {
    throw new Error(JSON.stringify(error));
  }
  assert(error.code === 0);
  var ret = error.data;
  ret.urls = getUrls(ret.weixin.server.host, ret.weixin.server.prefix, 'http');
  return ret;
};
