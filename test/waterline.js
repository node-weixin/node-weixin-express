'use strict';

var assert = require('assert');
var waterline = require('../lib/waterline');

describe('waterline', function () {
  it('should handler error!', function (done) {
    var callback = waterline.callback;
    var doer = callback(function (error, ontology) {
      assert(error);
      assert.deepEqual(ontology, {});
      done();
    });
    doer(true, {});
  });
});
