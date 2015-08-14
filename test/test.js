'use strict';
var nodeWeixinExpress = require('../');
var errors = require('web-errors').errors;

var request = require('supertest');
var assert = require('assert');

describe('node-weixin-express node module', function (done) {
  it('should be able to ack server auth', function () {
    var nodeWeixinAuth = require('node-weixin-auth');
    var token = 'sdfsdf';
    var server = nodeWeixinExpress({}, {token: token});
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
    var token = 'sdfsdf';
    var server = nodeWeixinExpress({}, {token: token});
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
    var token = 'sdfsdf';
    var server = nodeWeixinExpress({}, {token: token});
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
    var server = nodeWeixinExpress({}, {token: token, id: id, secret: secret,
    host: 'http://localhost'});
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

  it('should be able to handler oauth success', function () {
    var app = {
      id: 'id',
      secret: 'secret',
      token: 'token'
    };
    //Simulation for Weixin server response
    var code = 'aaa';
    var nock = require('nock');
    var params = {
      appid: app.id,
      secret: app.secret,
      grant_type: 'authorization_code',
      code: code,
      access_token: app.token
    };
    var url = 'https://api.weixin.qq.com';
    var reply = {
      openid: 'sofdso',
      access_token: 'sossoso',
      refresh_token: 'refresh_token'
    };

    nock(url)
      .post('/sns/oauth2/access_token')
      .query(params)
      .reply(200, reply);

    var server = nodeWeixinExpress({}, {token: app.token, id: app.id, secret: app.secret,
      host: 'http://localhost'});

    request(server)
      .post('/weixin/oauth/success')
      .send({
        code: code,
        state: 'state'
      })
      .expect(200)
      .end(function () {
        done();
      });
  });
});
