var path = require('path');
var parser = require('../lib/parser');
var settings = require('../lib/mySettings');
var assert = require('assert');
describe('parser', function () {


  it('shoulde parse config file', function() {
    var id = parser(settings, path.resolve('./test/assets/config.json'));
    assert.equal(true, id !== false);
    var app = settings.get(id, 'app');
    var oauth = settings.get(id, 'oauth');
    var merchant = settings.get(id, 'merchant');
    var certificate = settings.get(id, 'certificate');
    var urls = settings.get(id, 'urls');
    var message = settings.get(id, 'message');
  });

  it('shoulde be error parsing config file', function() {
    var id = parser(settings, path.resolve('./test/assets/config-error.json'));
    assert.equal(true, id === false);
  });

  it('shoulde be error parsing none json file', function() {
    var id = parser(settings, path.resolve('./test/assets/cert.p12'));
    assert.equal(true, id === false);
  });
});
