'use strict';
var assert = require('assert');
var path = require('path');
var express = require('express');
var parser = require('../lib/parser');
var app = express();
var config = parser(path.resolve(__dirname, './fixtures/config.yaml'));
var settings = require('node-weixin-settings');
var session = require('node-weixin-session');
var pages = require('../lib/pages');

pages(app, config, settings, session);

var request = require('supertest');

describe('pages', function () {
  it('should get index', function (done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text.indexOf('点击下面的按钮选择测试内容') !== -1);
        done();
      });
  });
  it('should get jssdk', function (done) {
    request(app)
      .get('/jssdk')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text.indexOf('JSSDK测试页') !== -1);
        done();
      });
  });
  it('should get oauth', function (done) {
    request(app)
      .get('/oauth')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text.indexOf('尚未指定OAuth跳转URL') !== -1);
        done();
      });
  });
  // it('should get pay', function (done) {
  //   request(app)
  //     .get('/pay')
  //     .expect(200)
  //     .end(function (err, res) {
  //       assert(!err);
  //       done();
  //     });
  // });
});
