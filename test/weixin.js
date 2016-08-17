'use strict';

var assert = require('assert');
var express = require('express');
var weixin = require('../lib/weixin');

describe('weixin', function () {
  var config = {
    weixin: {
      app: {
        id: 'sdfsfd'
      }
    },
    server: {
      prefix: '/weixin/api'
    }
  };
  it('should enable weixin getId!', function () {
    var obj = weixin.getId(config.weixin);
    obj({}, function (id) {
      assert(id === config.weixin.app.id);
    });
  });

  it('should init!', function (done) {
    weixin(function (router) {
      assert(router);
      done();
    }, express(), config);
  });
});
