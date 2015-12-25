var nwe = require('../lib/');

var express = nwe.server.express;
var settings = nwe.settings;

var errors = require('web-errors').errors;


var request = require('supertest');
var assert = require('assert');
var api = require('node-weixin-api');
var util = require('node-weixin-util');


var host = process.env.HOST || 'http://localhost';
var prefix = process.env.PREFIX || 'weixin';
var port = 10000;


var expressConf = {
  id: process.env.APP_ID,
  secret: process.env.APP_SECRET,
  token: process.env.APP_TOKEN
};

var app = {
  id: process.env.APP_ID,
  secret: process.env.APP_SECRET,
  token: process.env.APP_TOKEN
};

var urls = {
  jssdk: {
    main: host + '/pages/jssdk',
  },
  oauth: {
    access: host + '/' + prefix + '/oauth/access',
    success: host + '/' + prefix + '/oauth/success',
    redirect: host + '/pages/oauth',
  },
  pay: {
    callback: host + '/' + prefix + '/pay/callback',
    redirect: host + '/pages/pay',
    main: host + '/pages/pay'
  }
};

var oauth = {
  state: 'STATE',
  scope: 0
};

settings.set(app.id, 'host', host);
settings.set(app.id, 'app', app);
settings.set(app.id, 'oauth', oauth);
settings.set(app.id, 'urls', urls);

describe('node-weixin-express node module', function () {
  describe('#auth ack', function () {
    it('should be able to ack server auth', function (done) {
      var time = new Date().getTime();
      var nonce = 'nonce';
      var signature = api.auth.generateSignature(expressConf.token, time, nonce);
      var echostr = 'Hello world!';
      var data = {
        signature: signature,
        timestamp: time,
        nonce: nonce,
        echostr: echostr
      };
      var url = '/' + app.id + '/weixin/auth/ack?' + util.toParam(data);
      var server = express.start(port);
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
      var url = '/' + app.id + '/weixin/auth/ack?' + util.toParam(data);
      var server = express.start(port);
      request(server)
        .get(url)
        .expect(200)
        .expect(errors.SIGNATURE_NOT_MATCH)
        .end(done);
    });

    it('should not be able to ack server auth due to input invalid', function (done) {
      var time = new Date().getTime();
      var nonce = 'nonce';
      var signature = api.auth.generateSignature(app.token, time, nonce);
      var data = {
        signature: signature,
        timestamp: time,
        nonce: nonce
      };
      var url = '/' + app.id + '/weixin/auth/ack?' + util.toParam(data);
      var server = express.start(port);

      request(server)
        .get(url)
        .expect(200)
        .expect(errors.INPUT_INVALID)
        .end(done);
    });
  });

  describe('#oauth', function () {
    it('should be able to redirect to a url', function (done) {
      var server = express.start(port);

      request(server)
        .get('/' + app.id + '/weixin/oauth/access')
        .expect(302)
        .end(function (err, res) {
          assert.equal(true, !err);
          if (!err) {
            try {
              var location = api.oauth.createURL(app.id, urls.oauth.success, oauth.state, oauth.scope);
              assert.equal(true, location === res.headers.location);
            } catch (e) {
              throw e;
            }
          } else {
            throw err;
          }
          done();
        });
    });

    it('should be able to handle oauth not success', function (done) {
      var server = express.start(port);
      request(server)
        .get('/' + app.id + '/weixin/oauth/success')
        .expect(302)
        .end(function (err, res) {
          assert.equal(true, !err);
          assert.equal(true, res.headers.location === urls.oauth.access);
          done();
        });
    });

    it('should be able to handle oauth success', function (done) {
      var server = express.start(port);
      request(server)
        .get('/' + app.id + '/weixin/oauth/success')
        .expect(302)
        .end(function (err, res) {
          assert.equal(true, !err);
          assert.equal(true, urls.oauth.access === res.headers.location);
          done();
        });
    });

    it('should be able to handle oauth success', function (done) {
      var server = express.start(port);
      request(server)
        .get('/' + app.id + '/weixin/oauth/success?code=100')
        .expect(302)
        .end(function (err) {
          assert.equal(true, !err);
          done();
        });
    });
  });

  describe('#qrcode', function () {
    it('should get jssdk qrcode', function (done) {
      var server = express.start(port);
      request(server)
        .get('/' + app.id + '/qrcode/jssdk')
        .expect(200)
        .expect('Content-type', /svg/)
        .end(function (err) {
          assert.equal(true, !err);
          done();
        });
    });
    it('should get oauth qrcode', function (done) {
      var server = express.start(port);
      request(server)
        .get('/' + app.id + '/qrcode/oauth')
        .expect(200)
        .expect('Content-type', /svg/)
        .end(function (err) {
          assert.equal(true, !err);
          done();
        });
    });

    it('should get pay qrcode', function (done) {
      var server = express.start(port);
      request(server)
        .get('/' + app.id + '/qrcode/pay')
        .expect(200)
        .expect('Content-type', /svg/)
        .end(function (err) {
          assert.equal(true, !err);
          done();
        });
    });
  });
});
