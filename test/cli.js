'use strict';
var assert = require('assert');
var path = require('path');
var express = require('express');
var weixin = require('node-weixin-router');

describe('cli', function () {
  var file = path.resolve('./test/fixtures/config.yaml');
  process.argv = [
    'node',
    'dfdf',
    file
  ];
  var cli = require('../lib/cli');
  var realPath = path.resolve('./lib/cli') + '.js';
  it('should throw error', function () {
    delete require.cache[realPath];
    var catched = false;
    process.argv = [];
    try {
      require('../lib/cli');
    } catch (e) {
      assert(e.message === 'YAML 文件未指定！');
      catched = true;
    }
    assert(catched);
  });
  it('should test cli', function () {
    delete require.cache[realPath];

    var catched = false;
    process.argv = [
      'node',
      'dfdf',
      './file'
    ];
    try {
      require('../lib/cli');
    } catch (e) {
      assert(e.message === 'YAML 文件不存在！');
      catched = true;
    }
    assert(catched);
  });
  it('should test cli', function () {
    cli.callback(express(), weixin);
  });

  it('should test onAuthEvent', function () {
    cli.auth.event();
  });
  it('should test onAuthMessage', function () {
    cli.auth.message();
  });

  it('should test onOauthAccess', function () {
    cli.oauth.access();
  });
  it('should test onOAuthSuccess', function (done) {
    cli.oauth.success({}, {
      send: function (html) {
        assert(html.indexOf('尚未指定OAuth跳转URL') !== -1);
        done();
      }
    });
  });
});
