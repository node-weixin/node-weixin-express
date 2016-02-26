var weixin = require('./express/weixin');
var pages = require('./express/pages');
var config = require('./express/config');
var apis = require('./express/apis');
var qrcode = require('./express/qrcode');

export default [{
  path: '/:__appId/weixin',
  router: weixin()
}, {
  path: '/:__appId/pages',
  router: pages()
}, {
  path: '/:__appId/config',
  router: config()
}, {
  path: '/:__appId/apis',
  router: apis()
}, {
  path: '/:__appId/qrcode',
  router: qrcode()
}];
