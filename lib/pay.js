var pay = require('node-weixin-pay');
module.exports = {
  init: function(app, merchant, certificate, urls) {
    this.app = app;
    this.merchant = merchant;
    this.certifcate = certificate;
    this.urls = urls;
  },
  unified: function (data, cb) {
    pay.api.order.unified(this.certifcate, data, cb);
  },
  prepay: function(prepayId) {
    return pay.prepay(prepayId, this.app);
  }
};
