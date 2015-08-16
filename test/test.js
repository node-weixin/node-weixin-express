'use strict';
var nodeWeixinExpress = require('../');
var errors = require('web-errors').errors;

var request = require('supertest');
var assert = require('assert');

var id = process.env.APP_ID;
var secret = process.env.APP_SECRET;
var token = process.env.APP_TOKEN;
var jsurl = process.env.JSSDK_URL;
var host = process.env.HOST;

var expressConf = {
  id: id,
  secret: secret,
  token: token,
  'jssdk-url': jsurl,
  host: host
};

console.log(expressConf);

var server = nodeWeixinExpress({}, expressConf);

var port = 3334;

server.listen(port, function () {
  console.log('Weixin Express Server Running on Port %s', port);
});

describe('node-weixin-express node module', function (done) {
  it('should be able to ack server auth', function () {
    var nodeWeixinAuth = require('node-weixin-auth');
    var time = new Date().getTime();
    var nonce = 'nonce';
    var signature = nodeWeixinAuth.generateSignature(token, time, nonce);
    var echostr = 'Hello world!';
    var data = {
      signature: signature,
      timestamp: time,
      nonce: nonce,
      echostr: echostr
    };
    request(server)
      .post('/weixin/auth/ack')
      .send(data)
      .expect(200)
      .expect(data.echostr)
      .end(done);
  });

  it('should be able to ack server auth due to mismatch signature', function () {
    var time = new Date().getTime();
    var nonce = 'nonce';
    var echostr = 'Hello world!';
    var data = {
      signature: 'BAD',
      timestamp: time,
      nonce: nonce,
      echostr: echostr
    };
    request(server)
      .post('/weixin/auth/ack')
      .send(data)
      .expect(200)
      .expect(errors.SIGNATURE_NOT_MATCH)
      .end(done);
  });

  it('should not be able to ack server auth due to input invalid', function () {
    var nodeWeixinAuth = require('node-weixin-auth');
    var time = new Date().getTime();
    var nonce = 'nonce';
    var signature = nodeWeixinAuth.generateSignature(token, time, nonce);
    var data = {
      signature: signature,
      timestamp: time,
      nonce: nonce,
    };
    request(server)
      .post('/weixin/auth/ack')
      .send(data)
      .expect(200)
      .expect(errors.INPUT_INVALID)
      .end(done);
  });

  it('should be able to redirect to a url', function () {
    var nodeWeixinOauth = require('node-weixin-oauth');
    var token = 'sdfsdf';
    var id = 'sofdsofd';
    var secret = 'sosos';
    var server = nodeWeixinExpress({}, {
      token: token, id: id, secret: secret,
      host: 'http://localhost'
    });
    request(server)
      .get('/weixin/oauth/access')
      .expect(302)
      .end(function (err, res) {
        assert.equal(true, !err);
        if (!err) {
          var location = nodeWeixinOauth.createURL(id, 'http://localhost/weixin/oauth/success', 'status', 0);
          assert.equal(true, location === res.headers.location);
        } else {
          throw err;
        }
        done();
      });
  });
});
