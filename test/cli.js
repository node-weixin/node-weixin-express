'use strict';
var assert = require('assert');
var path = require('path');

describe('cli', function () {
  var file = path.resolve('./test/fixtures/config.yaml');
  process.argv = [
    'node',
    'dfdf',
    file
  ];
  var realPath = path.resolve('./lib/cli') + '.js';
  it('should throw error', function () {
    delete require.cache[realPath];
    var catched = false;
    process.argv = [];
    try {
      require('../lib/cli');
    } catch (e) {
      console.log(e);
      assert(e.message === 'Not validate key weixin');
      catched = true;
    }
    assert(catched);
  });
  it('should test cli', function () {
    delete require.cache[realPath];

    var catched = false;
    process.argv = [
      'node',
      'dfdf',
      './file'
    ];
    try {
      require('../lib/cli');
    } catch (e) {
      assert(e.message === 'YAML 文件不存在！');
      catched = true;
    }
    assert(catched);
  });

  it('should init!', function (done) {
    delete require.cache[realPath];
    process.argv = [
      'node',
      'dfdf',
      file
    ];
    var cli = require('../lib/cli');
    cli.onSuccess = function () {
      console.log('init end');
      var app = require('../lib/');
      app.callback();

      assert(app._config);
      assert(app._app);
      assert(app._weixin);
      assert(app._models);
      done();
    };
  });
});
