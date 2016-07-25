'use strict';

var assert = require('assert');
var parser = require('../lib/parser');
var path = require('path');

describe('parser', function () {
  it('should init template!', function () {
    var obj = parser(path.resolve(__dirname, './fixtures/config.yaml'));
    assert(obj);
  });
  it('should init template!', function () {
    var failed = false;
    try {
      parser(path.resolve(__dirname, './fixtures/config.1.yaml'));
    } catch (e) {
      failed = true;
    }
    assert(failed);
  });

  it('should throw exception!', function () {
    var failed = false;
    try {
      parser(path.resolve(__dirname, './fixtures/config.2.yaml'));
    } catch (e) {
      failed = true;
    }
    assert(failed);
  });
});
