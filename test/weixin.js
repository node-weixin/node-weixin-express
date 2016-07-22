'use strict';

var assert = require('assert');
var weixin = require('../lib/weixin');

describe('weixin', function () {
  it('should enable weixin getId!', function () {
    var config = {
      app: {
        id: 'sdfsfd'
      }
    };
    var obj = weixin.getId(config);
    obj({}, function (id) {
      assert(id === config.app.id);
    });
  });
});
