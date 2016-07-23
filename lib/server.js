var express = require('express');
var app = express();
var nodeWeixinExpress = require('./');

module.exports = function (cb, config, prefix) {
  nodeWeixinExpress(function (weixin) {
    cb(app, weixin);
  }, app, config, prefix);
};
