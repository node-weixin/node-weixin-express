'use strict';

// var assert = require('assert');
var event = require('../../lib/weixin/auth/event');

describe('auth event', function () {
  it('should handle events', function () {
    for (var k in event) {
      if (typeof k === 'string') {
        event[k]({});
      }
    }
  });
});
