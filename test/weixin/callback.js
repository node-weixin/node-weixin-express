'use strict';

var assert = require('assert');
var callback = require('../../lib/weixin/callback');

describe('weixin callback', function () {
  it('should init callback!', function () {
    callback.init({
      template: ''
    },
      {
        event: {},
        message: {}
      },
      {
        onAuthEvent: function () {

        },
        onAuthMessage: function () {

        },
        onOauthAccess: function () {

        },
        onOauthSuccess: function () {

        }
      }
    );
  });

  it('should test onAuthEvent', function () {
    callback.auth.event({
      Event: 'subscribe'
    });
  });
  it('should test onAuthMessage', function () {
    callback.auth.message({
      MsgType: 'event'
    });
  });

  it('should test onOauthAccess', function () {
    callback.oauth.access();
  });
  it('should test onOAuthSuccess', function (done) {
    callback.oauth.success({}, {
      send: function (html) {
        assert(html.indexOf('尚未指定OAuth跳转URL') !== -1);
        done();
      }
    });
  });
});
