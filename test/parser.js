var path = require('path');
var parser = require('../lib/parser');
var settings = require('../lib/mySettings');
var assert = require('assert');

var async = require('async');

describe('parser', function () {


  it('shoulde parse config file', function(done) {
    parser(settings, path.resolve('./test/assets/config.json'), function(id) {
      assert.equal(true, id !== false);
      async.series([(cb) => {
        settings.get(id, 'app', function(app) {
          assert.equal(true, app !== null);
          cb();
        });
      }, (cb) => {
        settings.get(id, 'oauth', function(oauth) {
          assert.equal(true, oauth !== null);
          cb();
        });
      }, (cb) => {
        settings.get(id, 'merchant', function(merchant) {
          assert.equal(true, merchant !== null);
          cb();
        });
      }, (cb) => {
        settings.get(id, 'certificate', function(certificate) {
          assert.equal(true, certificate !== null);
          cb();
        });
      }, (cb) => {
        settings.get(id, 'urls', function(urls) {
          assert.equal(true, urls !== null);
          cb();
        });
      }, (cb) => {
        settings.get(id, 'message', function(message) {
          assert.equal(true, message !== null);
          cb();
        });
      }], function() {
        done();
      });
    });
  });

  it('shoulde be error parsing config file', function(done) {
    parser(settings, path.resolve('./test/assets/config-error.json'), function(id) {
      assert.equal(true, id === false);
      done();
    });
  });

  it('shoulde be error parsing none json file', function(done) {
    parser(settings, path.resolve('./test/assets/cert.p12'), function(id) {
      assert.equal(true, id === false);
      done();
    });
  });
});
