var weixin = require('./express/weixin');
var pages = require('./express/pages');
var config = require('./express/config');
var apis = require('./express/apis');
var qrcode = require('./express/qrcode');

export default [{
  path: '/:id/weixin',
  router: weixin()
}, {
  path: '/:id/pages',
  router: pages()
}, {
  path: '/:id/config',
  router: config()
}, {
  path: '/:id/apis',
  router: apis()
}, {
  path: '/:id/qrcode',
  router: qrcode()
}];
