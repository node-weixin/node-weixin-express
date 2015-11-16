module.exports = {
  create: function(openId, ip, notifyUrl) {
    var data = {};
    data.openid = openId;
    data.spbill_create_ip = ip;
    data.notify_url = notifyUrl;
    data.body = "body";
    data.out_trade_no = 'noddf';
    data.total_fee = 1;
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
    return data;
  }
}
