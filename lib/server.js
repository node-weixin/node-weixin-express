var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
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

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(bodyParser.raw({
  type: 'text/xml'
}));

app.use(cookieParser());

module.exports = function (cb, config, prefix) {
  nodeWeixinExpress(function (weixin) {
    cb(app, weixin);
  }, app, config, prefix);
};
