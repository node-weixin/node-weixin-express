var assert = require('assert');

var session = require('../lib/mySession');


process.argv = process.argv.concat(['--port', '8717', '--test', 'true', '--config', 'test/assets/config.json']);

var cmd = require('../lib/cmd');

cmd.start(function (app) {


  var id = '13828382323';
  var secret = 'secret1';
  var token = 'token1';
  var host = 'www.sina.com';
  var state = 'STATE';
  var scope = 0;
  var merchant = {
    id: '201301032',
    key: '102020'
  };

  var certificate = {
    key: merchant.id
  };

  var cookies = null;

  describe('cli', function () {

    describe("config", function () {
      it('should be able to config app', function (done) {
        console.log('config app');
        var request = require('supertest');
        var req = request(app)
          .get('/' + id + '/config/app')
          .expect(200)
          .end(function (error, res) {
            console.log('inside config app');
            cookies = res.headers['set-cookie']
              .map(function (r) {
                return r.replace("; path=/; httponly", "")
              }).join("; ");
            console.log(error);
            assert.equal(true, !error);
            console.log('inside dont');
            done();
          });
      });
      it('should be able to config app', function (done) {
        var request = require('supertest');
        var req = request(app)
          .post('/' + id + '/config/app');
        req.cookies = cookies;
        req.send({
          secret: secret,
          token: token
        })
          .expect(200)
          .end(function (error, res) {
            console.log(error);
            console.log(id);

            assert.equal(true, !error);
            assert.equal(true, res.text.indexOf(id) !== -1);
            //assert.equal(true, res.text.indexOf(secret) !== -1);
            //assert.equal(true, res.text.indexOf(token) !== -1);
            done();
          });
      });
      it('should be able to config app', function (done) {
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

      it('should be able to config oauth', function (done) {
        var request = require('supertest');
        var req = request(app)
          .get('/' + id + '/config/oauth');
        req.cookies = cookies;
        req
          .expect(200)
          .end(function (error, res) {
            assert.equal(true, !error);
            assert.equal(true, res.text.indexOf('state') !== -1);
            assert.equal(true, res.text.indexOf('scope') !== -1);
            done();
          });
      });

      it('should be able to config oauth', function (done) {
        var request = require('supertest');
        var req = request(app)
          .post('/' + id + '/config/oauth');
        req.cookies = cookies;
        req
          .send({state: state, scope: scope})
          .expect(200)
          .end(function (error, res) {
            assert.equal(true, !error);
            assert.equal(true, res.text.indexOf(state) !== -1);
            assert.equal(true, res.text.indexOf(scope) !== -1);
            done();
          });
      });

      it('should be able to config oauth', function (done) {
        var request = require('supertest');
        var req = request(app)
          .get('/' + id + '/config/oauth');
        req.cookies = cookies;
        req
          .expect(200)
          .end(function (error, res) {
            assert.equal(true, !error);
            assert.equal(true, res.text.indexOf(state) !== -1);
            assert.equal(true, res.text.indexOf(scope) !== -1);
            done();
          });
      });

      it('should be able to config host', function (done) {
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
            assert.equal(true, res.text.indexOf('pages/jssdk') !== -1);
            assert.equal(true, res.text.indexOf('oauth/access') !== -1);
            assert.equal(true, res.text.indexOf('oauth/success') !== -1);
            assert.equal(true, res.text.indexOf('pages/oauth') !== -1);
            assert.equal(true, res.text.indexOf('pay/callback') !== -1);
            assert.equal(true, res.text.indexOf('pages/pay') !== -1);
            done();
          });
      });
      it('should be able to config host', function (done) {
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
            assert.equal(true, res.text.indexOf('pages/jssdk') !== -1);
            assert.equal(true, res.text.indexOf('oauth/access') !== -1);
            assert.equal(true, res.text.indexOf('oauth/success') !== -1);
            assert.equal(true, res.text.indexOf('pages/oauth') !== -1);
            assert.equal(true, res.text.indexOf('pay/callback') !== -1);
            assert.equal(true, res.text.indexOf('pages/pay') !== -1);

            done();
          });
      });
      it('should be able to config merchant', function (done) {
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
      it('should be able to config merchant', function (done) {
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

      it('should be able to config certificate', function (done) {
        var request = require('supertest');
        var req = request(app)
          .get('/' + id + '/config/certificate');
        req.cookies = cookies;
        req
          .expect(200)
          .end(function (error, res) {
            assert.equal(true, !error);
            assert.equal(true, res.text.indexOf(certificate.key) === -1);
            done();
          });
      });


      it('should be able to config certificate', function (done) {
        var request = require('supertest');
        var req = request(app)
          .post('/' + id + '/config/certificate');
        req.cookies = cookies;
        for (var key in certificate) {
          req.field(key, certificate[key]);
        }
        req
          .attach('pfx', __dirname + '/assets/cert.p12')
          .expect(200)
          .end(function (error, res) {
            assert.equal(true, !error);
            assert.equal(true, res.text.indexOf(certificate.key) !== -1);
            done();
          });
      });

      it('should be able to config certificate', function (done) {
        var request = require('supertest');
        var req = request(app)
          .get('/' + id + '/config/certificate');
        req.cookies = cookies;
        req
          .expect(200)
          .end(function (error, res) {
            assert.equal(true, !error);
            assert.equal(true, res.text.indexOf(certificate.key) !== -1);
            assert.equal(true, res.text.indexOf('私钥值') !== -1);
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
          });
      });

      it('should be able to get pay pages', function () {
        var request = require('supertest');
        var req = request(app)
          .get('/' + id + '/pages/pay');
        req.cookies = cookies;
        req
          .expect(200)
          .end(function (error, res) {
            assert.equal(true, !error);
            //session.set(req, 'openid', {openid: 1})
            //console.log(res.headers);
          });
      });

      it('should be able to get index pages', function () {
        var request = require('supertest');
        var req = request(app)
          .get('/' + id + '/pages/index');
        req.cookies = cookies;
        req
          .expect(302)
          .end(function (error, res) {
            assert.equal(true, !error);
            //session.set(req, 'openid', {openid: 1})
            //console.log(res.headers);
          });
      });
    });

    describe("check", function () {
      it('should redirect to root', function (done) {
        var check = require('../lib/router/express/check');
        check({
          params: {
            id: null
          }
        }, {
          redirect: function (url) {
            assert.equal(true, url === '/');
            done();
          }
        }, function () {
        });
      });


      it("should redirect with out set", function (done) {
        var check = require('../lib/router/express/check');
        check({
          params: {
            id: 'aaa'
          }
        }, {
          redirect: function (url) {
            console.log(url);
            assert.equal(true, url.length > 0);
            done();
          }
        }, function () {
        });
      });

    });

    describe("apis", function () {
      it('should be able to visit', function () {
        var request = require('supertest');
        var req = request(app)
          .get('/' + id + '/apis/type');
        req.cookies = cookies;
        req
          .expect(200)
          .end(function (error, res) {
            assert.equal(true, !error);
          });
      })
    });

    describe("/", function () {
      it('should be able to visit', function () {
        var request = require('supertest');
        var req = request(app)
          .get('/');
        req.cookies = cookies;
        req
          .expect(200)
          .end(function (error, res) {
            assert.equal(true, !error);
          });
      });
    });


    describe("session", function () {
      it('should get session by null request', function (done) {
        session.get(null, null, function () {
          assert.equal(true, true);
          done();
        });
      });
      it('should get session by request with no session', function (done) {
        session.get({
          asoso: 1
        }, null, function () {
          assert.equal(true, true);
          done()
        });
      });

      it('should get and set session by request', function (done) {
        session.set(null, 'aa', {data: 'temp'}, function () {
          session.get(null, 'aa', function (data) {
            assert.equal(true, data.data === 'temp');
            done();
          });
        });
      });
    });
  });
});
