var parser = require('../lib/cli-parser');
var assert = require('assert');

var session = require('../lib/mySession');


process.argv = process.argv.concat(['--port', '8717', '--test', 'true']);

var app = require('../lib/cli');

var id = '13828382323';
var secret = 'secret1';
var token = 'token1';
var host = 'www.sina.com';
var merchant = {
  id: '201301032',
  key: '102020'
};

var pay = {
  key: merchant.id
};

var cookies = null;

describe('cli', function () {

  describe("config", function() {
    it('should be able to config app', function(done) {
      var request = require('supertest');
      var req = request(app)
        .get('/' + id + '/config/app')
        .expect(200)
        .end(function (error, res) {
          assert.equal(true, !error);
          done();
        });
    });
    it('should be able to config app', function(done) {
      var request = require('supertest');
      var req = request(app)
        .post('/' + id + '/config/app');
      req.send({
          id: id,
          secret: secret,
          token: token
        })
        .expect(200)
        .end(function (error, res) {
          cookies = res.headers['set-cookie']
            .map(function (r) {
              return r.replace("; path=/; httponly", "")
            }).join("; ");
          assert.equal(true, !error);
          assert.equal(true, res.text.indexOf(id) !== -1);
          assert.equal(true, res.text.indexOf(secret) !== -1);
          assert.equal(true, res.text.indexOf(token) !== -1);
          done();
        });
    });
    it('should be able to config app', function(done) {
      var request = require('supertest');
      var req = request(app)
        .get('/' + id + '/config/app');
      req.cookies = cookies;
      req
        .expect(200)
        .end(function (error, res) {
          assert.equal(true, !error);
          assert.equal(true, res.text.indexOf(id) !== -1);
          assert.equal(true, res.text.indexOf(secret) !== -1);
          assert.equal(true, res.text.indexOf(token) !== -1);
          done();
        });
    });
    it('should be able to config host', function(done) {
      var request = require('supertest');
      var req = request(app)
        .get('/' + id + '/config/host');
      req.cookies = cookies;
      req
        .expect(200)
        .end(function (error, res) {
          assert.equal(true, !error);
          assert.equal(true, res.text.indexOf(host) === -1);
          assert.equal(true, res.text.indexOf('auth/ack') !== -1);
          assert.equal(true, res.text.indexOf('jssdk/config') !== -1);
          assert.equal(true, res.text.indexOf('oauth/access') !== -1);
          assert.equal(true, res.text.indexOf('oauth/success') !== -1);
          assert.equal(true, res.text.indexOf('page/oauth') !== -1);
          assert.equal(true, res.text.indexOf('pay/callback') !== -1);
          assert.equal(true, res.text.indexOf('page/pay') !== -1);
          done();
        });
    });
    it('should be able to config host', function(done) {
      var request = require('supertest');
      var req = request(app)
        .post('/' + id + '/config/host');
      req.cookies = cookies;
      req
        .send({
          host: host
        })
        .expect(200)
        .end(function (error, res) {
          assert.equal(true, !error);
          assert.equal(true, res.text.indexOf(host) !== -1);
          assert.equal(true, res.text.indexOf('auth/ack') !== -1);
          assert.equal(true, res.text.indexOf('jssdk/config') !== -1);
          assert.equal(true, res.text.indexOf('oauth/access') !== -1);
          assert.equal(true, res.text.indexOf('oauth/success') !== -1);
          assert.equal(true, res.text.indexOf('page/oauth') !== -1);
          assert.equal(true, res.text.indexOf('pay/callback') !== -1);
          assert.equal(true, res.text.indexOf('page/pay') !== -1);

          done();
        });
    });
    it('should be able to config merchant', function(done) {
      var request = require('supertest');
      var req = request(app)
        .get('/' + id + '/config/merchant');
      req.cookies = cookies;
      req
        .expect(200)
        .end(function (error, res) {
          assert.equal(true, !error);
          assert.equal(true, res.text.indexOf(merchant.id) === -1);
          assert.equal(true, res.text.indexOf(merchant.key) === -1);
          done();
        });
    });
    it('should be able to config merchant', function(done) {
      var request = require('supertest');
      var req = request(app)
        .post('/' + id + '/config/merchant');
      req.cookies = cookies;
      req
        .send(merchant)
        .expect(200)
        .end(function (error, res) {
          assert.equal(true, !error);
          assert.equal(true, res.text.indexOf(merchant.id) !== -1);
          assert.equal(true, res.text.indexOf(merchant.key) !== -1);
          done();
        });
    });

    it('should be able to config pay', function(done) {
      var request = require('supertest');
      var req = request(app)
        .get('/' + id + '/config/pay');
      req.cookies = cookies;
      req
        .expect(200)
        .end(function (error, res) {
          assert.equal(true, !error);
          assert.equal(true, res.text.indexOf(pay.key) === -1);
          done();
        });
    });


    it('should be able to config pay', function(done) {
      var request = require('supertest');
      var req = request(app)
        .post('/' + id + '/config/pay');
      req.cookies = cookies;
      for(var key in pay) {
        req.field(key, pay[key]);
      }
      req
        .attach('pfx', __dirname + '/assets/cert.p12')
        .expect(200)
        .end(function (error, res) {
          assert.equal(true, !error);
          assert.equal(true, res.text.indexOf(pay.key) !== -1);
          done();
        });
    });

    it('should be able to config pay', function(done) {
      var request = require('supertest');
      var req = request(app)
        .get('/' + id + '/config/pay');
      req.cookies = cookies;
      req
        .expect(200)
        .end(function (error, res) {
          assert.equal(true, !error);
          assert.equal(true, res.text.indexOf(pay.key) !== -1);
          done();
        });
    });

  });

  describe("pages", function () {

    it('should be able to get jssdk pages', function (done) {
      var request = require('supertest');
      var req = request(app)
        .get('/' + id + '/pages/jssdk');
      req.cookies = cookies;
      req
        .expect(200)
        .end(function (error, res) {
          assert.equal(true, !error);
          assert.equal(true, res.text.indexOf('测试扫码') !== -1);
          done();
        });
    });
    it('should be able to get oauth pages', function () {
      var request = require('supertest');
      var req = request(app)
        .get('/' + id + '/pages/oauth');
      req.cookies = cookies;
      req
        .expect(200)
        .expect('Content-Type', /html/)
        .end(function (error, res) {
          assert.equal(true, !error);
          assert.equal(true, res.text.indexOf('连接成功!') !== 1);
        });
    });

    it('should be able to get pay pages', function () {
      var request = require('supertest');
      var req = request(app)
        .get('/' + id + '/pages/pay');
      req.cookies = cookies;
      req
        .expect(302)
        .end(function (error, res) {
          assert.equal(true, !error);
          //session.set(req, 'openid', {openid: 1})
          //console.log(res.headers);
        });
    });

    //it('should be able to get pay pages', function () {
    //  var request = require('supertest');
    //  var req = request(app)
    //    .get('/' + id + '/pages/pay');
    //  console.log(req.app);
    //  req.cookies = cookies;
    //  req
    //    .expect(200)
    //    .end(function (error, res) {
    //      assert.equal(true, !error);
    //      console.log(res.text);
    //    });
    //});
  });

});
