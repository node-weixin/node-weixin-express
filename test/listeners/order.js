import order from '../../lib/listeners/order';
import settings from '../../lib/mySettings';
import session from '../../lib/mySession';
import assert from 'assert';
import async from 'async';


describe('order', function () {
  it('should handle onCreate event', function (done) {
    var req = {
      headers: {},
      params: {
        __appId: '1'
      },
      session: {
        __appId: '1'
      },
      ip: '127.0.0.1'
    };
    async.series([(cb) => {
        session.set(req, 'openid', {
          openid: 'sss'
        }, cb);
      }, (cb) => {
        settings.set(req.params.__appId, 'urls', {
          pay: {
            callback: ''
          }
        }, cb);
      }],
      function () {
        order.onCreate(req, {}, function (error, data) {
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
  });

  it('should run onNotify event', function () {
    order.onNotify();
  });
});
