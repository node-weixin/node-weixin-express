var express = require('express');
var app = express();
var nodeWeixinExpress = require('./');

module.exports = function (config, cb) {
  nodeWeixinExpress(function (weixin) {
    cb(app, weixin);
  }, app, config, '/weixin/api');
};
