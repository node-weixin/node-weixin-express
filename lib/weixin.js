/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var skipper = require('skipper');
var weixinRouter = require('node-weixin-router');
var weixinSession = require('node-weixin-session');
var weixinSettings = require('node-weixin-settings');
var assert = require('assert');
var async = require('async');
var uploader = skipper();

function getId(config) {
  return function (req, next) {
    next(config.app.id);
  };
}

module.exports = function (cb, app, config, prefix) {
  // For weixin config
  app.use(uploader);
  prefix = prefix || '';
  if (prefix) {
    assert(prefix.indexOf('/') !== -1);
  }
  weixinRouter.express(weixinSettings, weixinSession, app, prefix);
  weixinRouter.getId = getId(config);
  var id = config.app.id;
  async.each(Object.keys(config), function (k, callback) {
    weixinSettings.set(id, k, config[k], function () {
      callback();
    });
  }, function () {
    cb(weixinRouter);
  });
};

module.exports.getId = getId;
