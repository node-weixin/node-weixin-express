var express = require('express');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var weixinRouter = require('node-weixin-router');

var routers = require('../router/express');
var session = require('../mySession');
var async = require('async');

module.exports = {
  /**
   * default express server
   * @returns {*}
   */
  prepare: function () {

    var http = express();

    http.use(bodyParser.urlencoded({extended: false}));
    http.use(bodyParser.json());
    http.use(bodyParser.raw({type: 'text/xml'}));
    http.use(cookieParser());
    http.set('trust proxy', 1); // trust first proxy
    http.use(expressSession({secret: 'osososss', cookie: {maxAge: 60000}, resave: true, saveUninitialized: true}));
    return http;
  },
  initCallbacks: function() {

    var order = require('../listeners/order');
    var oauth = require('../listeners/oauth');

    weixinRouter.onCreate(order.onCreate);
    weixinRouter.onNotify(order.onNotify);
    weixinRouter.onOauth(oauth.onOAuth);
  },

  /**
   *
   * @param port
   * @param host
   * @param prefix
   * @param http
   * @returns {*}
   */
  start: function (port, host, prefix, http, next) {
    async.series([(cb) => {
      session.set(null, 'host', host, cb);
    }, (cb) => {
      session.set(null, 'port', port, cb);
    }, (cb) => {
      session.set(null, 'prefix', prefix, cb);
    }], function() {
      http = http || this.prepare();
      routers.forEach(function (router) {
        http.use(router.path, router.router);
      });
      next();
    });

  }
};
