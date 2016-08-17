/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var weixinRouter = require('node-weixin-router');
var weixinSession = require('node-weixin-session');
var weixinSettings = require('node-weixin-settings');
var assert = require('assert');
var async = require('async');

var pages = require('./pages');

function getId(config) {
  return function (req, next) {
    next(config.app.id);
  };
}

module.exports = function (cb, app, config) {
  // For weixin config
  var prefix = (config.weixin.server && config.weixin.server.prefix) || '';
  if (prefix) {
    assert(prefix.indexOf('/') !== -1);
  }

  weixinRouter.express(weixinSettings, weixinSession, app, prefix);
  weixinRouter.getId = getId(config.weixin);
  var id = config.weixin.app.id;
  async.each(Object.keys(config.weixin), function (k, callback) {
    weixinSettings.set(id, k, config.weixin[k], function () {
      callback();
    });
  }, function () {
    cb(app, weixinRouter);
  });
  pages(app, config, weixinSettings, weixinSession);
};

module.exports.getId = getId;
