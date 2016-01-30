var express = require('express');
var Router = express.Router;
var settings = require('../../mySettings');
var qr = require('qr-image');

export default function qrcode() {
  var router = new Router({mergeParams: true});
  router.all('/:type', function (req, res) {
    var id = req.params.__appId;
    var str = '';
    settings.get(id, 'urls', function(urls) {
      switch (req.params.type) {
        case 'jssdk':
          str = urls.jssdk.main;
          break;
        case 'oauth':
          str = urls.oauth.access;
          break;
        case 'pay':
          str = urls.pay.main;
          break;
      }
      var code = qr.image(str, {type: 'svg'});
      res.type('svg');
      code.pipe(res);
    });
  });
  return router;
}
