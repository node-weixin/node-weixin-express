'use strict';

var assert = require('assert');
var template = require('../lib/template');

describe('template', function () {
  it('should init template!', function () {
    var obj = template('./lib/views');
    assert(obj);
  });

  it('should fail to init template!', function () {
    var failed = false;
    try {
      template('./lib/abc');
    } catch (e) {
      failed = true;
    }
    assert(failed);
  });

  it('should fail to init template!', function () {
    var obj = template();
    assert(obj);
  });
});
