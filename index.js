'use strict';

function restApi(res, error, data) {
  var _ = require("lodash");
  var json = _.assign({}, error);
  if (data) {
    json.data = data;
  } else {
    delete json.data;
  }
  res.json(json);
}

function readyExpress() {
  var express = require('express');
  var bodyParser = require('body-parser');
  var session = require('express-session');
  var http = express();

  http.use(bodyParser.urlencoded({extended: false}));
  http.use(bodyParser.json());
  http.set('trust proxy', 1); // trust first proxy
  http.use(session({secret: 'mysecret', cookie: {maxAge: 60000}, resave: true, saveUninitialized: true}));
  return http;
}
function initAuth(http, token) {
  var auths = require('./routes/auth');
  for(var key in auths) {
    http.all(key, auths[key](token));
  }
}

function initOAuth(http, app, urls) {
  var oauths = require('./routes/oauth');

  function onOauthSuccess(req, res) {
    //Redirect to user defined page.
    res.redirect(urls.redirect);
  }

  for(var k in oauths) {
    http.all(k, oauths[k](app, urls, onOauthSuccess));
  }
}

function initJSSDK(http, app, url) {
  var jssdk = require('./routes/jssdk');
  for(var k in jssdk) {
    http.all(k, jssdk[k](app, url, restApi));
  }
}

module.exports = function (values, flags) {



  //Getting data from cli
  var id = flags['id'] || process.env.APP_ID || 'ID';
  var secret = flags['secret'] || process.env.APP_SECRET || 'SECRET';
  var token = flags['token'] || process.env.APP_TOKEN || 'TOKEN';
  var host = flags['host'] || process.env.HOST || 'http://localhost';
  var redirect = flags['redirect'] || process.env.REDIRECT || null;

  var jsurl = flags['jssdk-url'] || process.env.JSSDK_URL || 'http://localhost';



  //Init configuration
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


  var http = readyExpress();
  initAuth(http, token);
  initOAuth(http, app, urls);
  initJSSDK(http, app, jsurl);

  return http;
};
