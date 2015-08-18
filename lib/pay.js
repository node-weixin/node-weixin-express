var pay = require('node-weixin-pay');
module.exports = {
  init: function(app, merchant, certificate, urls) {
    this.app = app;
    this.merchant = merchant;
    this.certificate = certificate;
    this.urls = urls;
  },
  unified: function (data, cb) {
    var config = {
      app: this.app,
      merchant: this.merchant,
      certificate: this.certificate
    };
    pay.api.order.unified(config, data, cb);
  },
  prepay: function(prepayId) {
    return pay.prepay(prepayId, this.app, this.merchant);
  }
};
