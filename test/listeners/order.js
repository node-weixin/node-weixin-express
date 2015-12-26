import order from '../../lib/listeners/order';
import settings from '../../lib/mySettings';
import session from '../../lib/mySession';
import assert from 'assert';


describe('order', function () {
  it('should handle onCreate event', function (done) {
    var req = {headers: {}, params: {id: '1'}, session: {id: '1'}, ip : '127.0.0.1'};
    session.set(req, 'openid', {openid: 'sss'});
    settings.set(req.params.id, 'urls', {pay: {callback: ''}});

    order.onCreate(req, {}, function (error, data) {
      console.log(error, data);
      assert.equal(true, !error);
      assert.equal(true, data.openid === 'sss');
      assert.equal(true, data.spbill_create_ip === '127.0.0.1');
      assert.equal(true, data.notify_url === '');
      assert.equal(true, data.body === 'body');
      assert.equal(true, data.out_trade_no > 1);
      assert.equal(true, data.total_fee >= 1);
      assert.equal(true, data.trade_type === 'JSAPI');
      done();
    });
  });

  it('should run onNotify event', function () {
    order.onNotify();
  });
});
