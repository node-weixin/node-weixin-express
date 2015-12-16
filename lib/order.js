module.exports = {
  /**
   * order creation process wil be called when an order creation request is sent
   * @param appConfig
   * @returns {Function}
   */
  onCreate: function (appConfig) {
    console.log(appConfig);

    return function (req, res) {
      console.log(req, res);

      var data = {};
      //data.openid = openId;
      //data.spbill_create_ip = ip;
      //data.notify_url = notifyUrl;
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
