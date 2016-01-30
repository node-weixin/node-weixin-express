var session = require('../mySession');
var settings = require('../mySettings');
var async = require('async');

module.exports = {
  /**
   * order creation process wil be called when an order creation request is sent
   * @returns {Function}
   */
  onCreate: function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] ||
      (req.connection ? req.connection.remoteAddress : null) || req.ip;
    ip = ip.split(',')[0];
    var id = req.params.__appId;
    var urls = null;
    var wx = null;
    async.series([(cb) => {
      settings.get(id, 'urls', function (urlsSaved) {
        urls = urlsSaved;
        cb();
      });
    }, (cb) => {
      session.get(req, 'openid', function (wxSaved) {
        wx = wxSaved;
        cb();
      });
    }], function () {
      var data = {};
      data.openid = wx.openid;
      data.spbill_create_ip = ip;
      /*eslint camelcase: [2, {properties: "never"}]*/
      data.notify_url = urls.pay.callback;
      data.body = 'body';
      /*eslint camelcase: [2, {properties: "never"}]*/
      data.out_trade_no = '' + new Date().getTime();
      /*eslint camelcase: [2, {properties: "never"}]*/
      data.total_fee = 1;
      /*eslint camelcase: [2, {properties: "never"}]*/
      data.trade_type = 'JSAPI';

      // mostly useless
      //data.sub_mch_id = 'xxx'
      //data.device_info = 'xxx'
      //data.attach = 'xxx'
      //data.time_start = 'xxx'
      //data.time_expire = 'xxx'
      //data.goods_tag = 'xxx'
      //data.product_id = 'xxx'
      //data.attach = 'xxx'
      next(false, data);
    });
    //var urls = settings.get(id, 'urls');
    //var wx = session.get(req, 'openid');

  },
  /**
   * Order process status callback
   *
   * @param appConfig
   * @returns {Function}
   */
  onNotify: function (error, data) {
    console.log(error, data);
  }
};
