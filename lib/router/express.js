var api = require('./express/api');
var pages = require('./express/pages');
var config = require('./express/config');

export default [{
  path: '/:id/weixin',
  router: api()
}, {
  path: '/:id/pages',
  router: pages()
}, {
  path: '/:id/config',
  router: config()
}];
