import oauth from '../../lib/listeners/oauth';
import assert from 'assert';

describe('oauth', function () {
  it('should have onOAuth', function() {
    oauth.onOAuth({session: {__appId: '1'}}, {openid: 'openid'});
    assert.equal(true, oauth.onOAuth instanceof Function)
  })
});
