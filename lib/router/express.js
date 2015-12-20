var weixinRouter = require('node-weixin-router');
var express = require('express');
var Router = express.Router;

var session = require('../mySession');


function api() {
  var router = new Router();
  weixinRouter.init(router);
  return router;
}

function template() {
  var router = new Router();
  router.all('/jssdk', function (req, res) {
    var host = session.get(req, 'host');
    res.render('jssdk-main', {host: host});
  });
  router.all('/oauth', function (req, res) {
    res.render('oauth-redirect');
  });

  router.all('/pay', function (req, res) {
    var openid = session.get(req, 'openid');
    if (!openid || !openid.openid) {
      var urls = session.get(req, 'urls');
      res.redirect(urls.access);
      return;
    }
    res.render('pay-main');
  });
  return router;
}
function config() {
  var router = new Router();
  router.all('/:type', function (req, res) {
    var type = 'app';
    switch (req.params.type) {
      case 'app':
      case 'merchant':
      case 'oauth':
      case 'urls':
        type = req.params.type;
        break;
    }
    res.render('config', {
      type: type
    });
  });
  return router;
}


export default [
  {
    path: '/weixin',
    router: api()
  }
  ,
  {
    path: '/page',
    router: template()
  }
  ,
  {
    path: '/config',
    router: config()
  }];
