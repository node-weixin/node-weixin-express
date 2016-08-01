'use strict';

// var assert = require('assert');
var lt = require('../lib/localtunnel');

describe('localtunnel', function () {
  it('should test close!', function () {
    lt._tunnel.close();
    // assert(false, 'we expected this package author to add actual unit tests.');
  });
  it('should test connected!', function () {
    var func = lt._tunnel.connected({
      open: true
    });
    func(false, {
      url: 'sodfosfsdf'
    });
    func(true, {
      url: 'sodfosfsdf'
    });
  });

  it('should test error!', function () {
    var func = lt._tunnel.error({
      open: true
    });
    func(false);
    func(true);
    func('localtunnel.me');
  });
});
