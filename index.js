'use strict';
module.exports = function (values, flags) {
  var id = flags['id'] || process.env.APP_ID || 'ID';
  var secret = flags['secret'] || process.env.APP_SECRET || 'SECRET';
  var token = flags['token'] || process.env.APP_TOKEN || 'TOKEN';
  var host = flags['host'] || process.env.HOST || 'http://localhost';
  var redirect = flags['redirect'] || process.env.REDIRECT || null;
  var app = {
    id: id,
    secret: secret,
    token: token
  };

  var urls = {
    access: host + '/weixin/oauth/access',
    success: host + '/weixin/oauth/success',
    redirect: redirect || host + '/weixin/oauth/redirect'
  };

  var express = require('express');
  var bodyParser = require('body-parser');
  var session = require('express-session');

  var http = express();

  http.use(bodyParser.urlencoded({ extended: false }));
  http.use(bodyParser.json());
  http.set('trust proxy', 1); // trust first proxy
  http.use(session({ secret: 'mysecret', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true}));

  //Init auth
  var auths = require('./routes/auth');
  for(var key in auths) {
    http.get(key, auths[key](token)).post(key, auths[key](token));
  }


  //Init oauth
  var oauths = require('./routes/oauth');
  function onOauthSuccess(req, res) {
    //Redirect to user defined page.
    res.redirect(urls.redirect);
  }

  for(var k in oauths) {
    http.get(k, oauths[k](app, urls, onOauthSuccess)).post(k, oauths[k](app, urls, onOauthSuccess));
  }
  return http;
};
