var session = require('../mySession');

module.exports = {
  /**
   * order creation process wil be called when an order creation request is sent
   * @returns {Function}
   */
  onCreate: function () {
    return function (req) {
      var ip = req.headers['x-forwarded-for'] ||
        (req.connection ? req.connection.remoteAddress : null) || req.ip;
      ip = ip.split(',')[0];
      var urls = session.get(req, 'urls');

      var data = {};
      //data.openid = openId;
      data.spbill_create_ip = ip;
      /*eslint camelcase: [2, {properties: "never"}]*/
      data.notify_url = urls.pay.callback;
      //data.body = "body";
      //data.out_trade_no = 'noddf';
      //data.total_fee = 1;
      //data.trade_type = 'JSAPI';

      // mostly useless
      //data.sub_mch_id = 'xxx'
      //data.device_info = 'xxx'
      //data.attach = 'xxx'
      //data.time_start = 'xxx'
      //data.time_expire = 'xxx'
      //data.goods_tag = 'xxx'
      //data.product_id = 'xxx'
      //data.attach = 'xxx'
      return data;
    };
  },
  /**
   * Order process status callback
   *
   * @param appConfig
   * @returns {Function}
   */
  onNotify: function (appConfig) {
    return function (error, data) {
      console.log(error, data);
      console.log(appConfig);
    };
  }
};
