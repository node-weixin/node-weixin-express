var express = require('express');
var app = express();
var session = require('express-session');
var nodeWeixinExpress = require('./');

// trust first proxy
app.set('trust proxy', 1);
app.use(session({
  secret: process.env.NODE_WEIXIN_EXPRESS_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true
  }
}));

module.exports = function (cb, config, prefix) {
  nodeWeixinExpress(function (weixin) {
    cb(app, weixin);
  }, app, config, prefix);
};
