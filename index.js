'use strict';

var weixin = require('./weixin');
var express = require('./server/express');
module.exports = {
  weixin: weixin,
  server: {
    express: express
  }
};
