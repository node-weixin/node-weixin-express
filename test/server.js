'use strict';

var assert = require('assert');
var server = require('../lib/server');
var parser = require('../lib/parser');
var path = require('path');

describe('server', function () {
  it('should init server!', function (done) {
    var config = parser(path.resolve(__dirname, './fixtures/config.yaml'));
    server(config, function (app, weixin) {
      assert(app);
      assert(weixin);
      done();
    });
  });
});
