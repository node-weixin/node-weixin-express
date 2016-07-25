'use strict';

var assert = require('assert');
var express = require('express');
var weixin = require('../lib/weixin');

describe('weixin', function () {
  var config = {
    app: {
      id: 'sdfsfd'
    }
  };
  it('should enable weixin getId!', function () {
    var obj = weixin.getId(config);
    obj({}, function (id) {
      assert(id === config.app.id);
    });
  });

  it('should init!', function (done) {
    weixin(function (router) {
      assert(router);
      done();
    }, express(), config);
  });
});
