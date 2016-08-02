'use strict';

// var assert = require('assert');
var lt = require('../lib/localtunnel');

describe('localtunnel', function () {
  it('should test close!', function () {
    lt._tunnel.close();
    // assert(false, 'we expected this package author to add actual unit tests.');
  });
  it('should test connected!', function (done) {
    var called = false;
    var func = lt._tunnel.connected({
      open: true
    }, function () {
      if (!called) {
        called = true;
        done();
      }
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

  it('should test none stopped !', function () {
    lt._tunnel._status = 'starting';
    lt._tunnel.start();
    lt._tunnel.restart();
  });
});
