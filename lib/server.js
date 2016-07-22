var express = require('express');
var app = express();
var nodeWeixinExpress = require('./');

// var templater = template(config);

module.exports = function (config, cb) {
  nodeWeixinExpress(function (weixin) {
    weixin.onAuthEvent(function () {
      console.log('on Auth Event');
      console.log(arguments);
    });
    weixin.onAuthMessage(function () {
      console.log('on Auth Message');
      console.log(arguments);
    });
    cb(app);
  }, app, config, '/weixin/api');
};
