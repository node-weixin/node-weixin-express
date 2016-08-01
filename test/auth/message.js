'use strict';

// var assert = require('assert');
var message = require('../../lib/weixin/auth/message');

describe('auth event', function () {
  it('should handle message', function () {
    for (var k in message) {
      if (typeof k === 'string') {
        message[k]({});
      }
    }
  });
});
