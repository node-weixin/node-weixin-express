var parser = require('../lib/cli-parser');
var assert = require('assert');
describe('node-weixin-express ci-parser module', function () {
  it('shoulde parse auth basic', function() {
    var flags = {
      id: 'asfdsf',
      secret: 'sdfsfd',
      token: 'token'
    };
    var data = parser(flags);
    assert.equal(true, data.app.id === flags.id);
    assert.equal(true, data.app.secret === flags.secret);
    assert.equal(true, data.app.token === flags.token);
  });
  it('shoulde parse oauth', function() {
    var flags = {
      scope: 0,
      state: 'STATE',
      host: 'http://www.sina.com.cn',
      redirect: 'http://www.sina.com.cn'
    };
    var data = parser(flags);
    assert.equal(true, data.oauth.state === flags.state);
    assert.equal(true, data.oauth.scope === flags.scope);
    assert.equal(true, data.oauth.host === flags.host);
    assert.equal(true, data.oauth.redirect === flags.redirect);
  });

  it('shoulde parse oauth 2', function() {
    var flags = {
      scope: 1,
      state: 'STATE2',
      host: 'http://www.sina2.com.cn',
      redirect: 'http://www.sina3.com.cn'
    };
    var data = parser(flags);
    assert.equal(true, data.oauth.state === flags.state);
    assert.equal(true, data.oauth.scope === flags.scope);
    assert.equal(true, data.oauth.host === flags.host);
    assert.equal(true, data.oauth.redirect === flags.redirect);
  });
});
