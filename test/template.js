'use strict';

var assert = require('assert');
var template = require('../lib/template');

describe('node-weixin-express', function () {
  it('should init template!', function () {
    var obj = template({
      template: '../lib/views'
    });
    assert(obj);
  });

  it('should fail to init template!', function () {
    var failed = false;
    try {
      template({
        template: '../lib/abc'
      });
    } catch (e) {
      failed = true;
    }
    assert(failed);
  });

  it('should fail to init template!', function () {
    var obj = template({
    });
    console.log(obj);
    assert(obj);
  });
});
