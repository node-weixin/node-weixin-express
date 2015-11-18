'use strict';
var weixin = require('../lib/weixin');
var express = require('../lib/server/express');

var errors = require('web-errors').errors;


var request = require('supertest');
var assert = require('assert');
var api = require('node-weixin-api');
var util = require('node-weixin-util');


var id = process.env.APP_ID;
var secret = process.env.APP_SECRET;
var token = process.env.APP_TOKEN;
var host = process.env.HOST || 'localhost';

var expressConf = {
  id: id,
  secret: secret,
  token: token,
  host: host
};
var server = express.parse({}, expressConf, weixin);


describe('node-weixin-express node module', function () {
  describe('#auth ack', function () {
    it('should be able to ack server auth', function (done) {
      var time = new Date().getTime();
      var nonce = 'nonce';
      var signature = api.auth.generateSignature(token, time, nonce);
      var echostr = 'Hello world!';
      var data = {
        signature: signature,
        timestamp: time,
        nonce: nonce,
        echostr: echostr
      };
      var url = '/weixin/auth/ack?' + util.toParam(data);
      request(server)
        .get(url)
        .expect(200)
        .expect(data.echostr)
        .end(done);
    });

    it('should be able to ack server auth due to mismatch signature', function (done) {
      var time = new Date().getTime();
      var nonce = 'nonce';
      var echostr = 'Hello world!';
      var data = {
        signature: 'BAD',
        timestamp: time,
        nonce: nonce,
        echostr: echostr
      };
      var url = '/weixin/auth/ack?' + util.toParam(data);

      request(server)
        .get(url)
        .expect(200)
        .expect(errors.SIGNATURE_NOT_MATCH)
        .end(done);
    });

    it('should not be able to ack server auth due to input invalid', function (done) {
      var time = new Date().getTime();
      var nonce = 'nonce';
      var signature = api.auth.generateSignature(token, time, nonce);
      var data = {
        signature: signature,
        timestamp: time,
        nonce: nonce,
      };
      var url = '/weixin/auth/ack?' + util.toParam(data);

      request(server)
        .get(url)
        .expect(200)
        .expect(errors.INPUT_INVALID)
        .end(done);
    });
  });

  describe("#oauth", function () {
    it('should be able to redirect to a url', function (done) {
      var token = 'sdfsdf';
      var id = 'sofdsofd';
      var secret = 'sosos';
      var server = express.parse({}, {
        token: token, id: id, secret: secret,
        host: 'localhost'
      }, weixin);
      request(server)
        .get('/weixin/oauth/access')
        .expect(302)
        .end(function (err, res) {
          assert.equal(true, !err);
          if (!err) {
            var location = api.oauth.createURL(id, 'http://localhost/weixin/oauth/success', 'STATE', 0);
            assert.equal(true, location === res.headers.location);
          } else {
            throw err;
          }
          done();
        });
    });

    it('should be able to handle oauth success', function (done) {
      var token = 'sdfsdf';
      var id = 'sofdsofd';
      var secret = 'sosos';
      var server = express.parse({}, {
        token: token, id: id, secret: secret,
        host: 'localhost'
      }, weixin);
      request(server)
        .get('/weixin/oauth/success')
        .expect(302)
        .end(function (err, res) {
          assert.equal(true, !err);
          assert.equal(true, 'http://localhost/weixin/oauth/access' === res.headers.location);
          done();
        });
    });

    it('should be able to handle oauth success', function (done) {
      var token = 'sdfsdf';
      var id = 'sofdsofd';
      var secret = 'sosos';
      var server = express.parse({}, {
        token: token, id: id, secret: secret,
        host: 'localhost'
      }, weixin);
      request(server)
        .get('/weixin/oauth/success')
        .expect(302)
        .end(function (err, res) {
          assert.equal(true, !err);
          assert.equal(true, 'http://localhost/weixin/oauth/access' === res.headers.location);
          done();
        });
    });

    it('should be able to handle oauth success', function (done) {
      var token = 'sdfsdf';
      var id = 'sofdsofd';
      var secret = 'sosos';
      var server = express.parse({}, {
        token: token, id: id, secret: secret,
        host: 'localhost'
      }, weixin);
      request(server)
        .get('/weixin/oauth/success?code=100')
        .expect(302)
        .end(function (err, res) {
          assert.equal(true, !err);
          assert.equal(true, 'http://localhost/weixin/oauth/access' === res.headers.location);
          done();
        });
    });
  });


});
