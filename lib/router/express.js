var weixinRouter = require('node-weixin-router');
var express = require('express');
var Router = express.Router;

var session = require('../mySession');
var settings = require('../mySettings');


function api() {
  var router = new Router();
  weixinRouter.init(router);
  return router;
}

function template() {
  var router = new Router();
  router.all('/jssdk', function (req, res) {
    var host = session.get(null, 'host');
    res.render('jssdk-main', {
      host: host
    });
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
    var host = session.get(null, 'host') || '';
    var prefix = session.get(null, 'prefix') || 'weixin';
    var id = session.get(null, 'id');
    var data = {};
    data.updated = false;

    var type = req.params.type;
    if (id) {
      switch (req.params.type) {
        case 'host':
          if (req.body.host) {
            host = req.body.host;
            settings.set(id, 'host', host);
          }
          var urls = {
            auth: {
              ack: host + '/' + prefix + '/auth/ack'
            },
            jssdk: {
              config: host + '/' + prefix + '/jssdk/config'
            },
            oauth: {
              access: host + '/' + prefix + '/oauth/access',
              success: host + '/' + prefix + '/oauth/success',
              redirect: host + '/page/oauth'
            },
            pay: {
              callback: host + '/' + prefix + '/pay/callback',
              redirect: host + '/page/pay'
            }
          };
          settings.set(id, 'urls', urls);
          data.urls = urls || {auth: {}, oauth: {}, pay: {}};
          break;
        case 'app':
          if (Object.keys(req.body).length !== 0) {
            id = req.body.id;
            session.set(null, 'id', id);
          }
        case 'merchant':
        case 'message':
        case 'pay':

          if (Object.keys(req.body).length !== 0) {
            data.updated = false;
            settings.set(id, type, req.body);
          }
          break;
      }
    } else {
      type = 'app';
      switch (req.params.type) {
        case 'host':
          if (req.body.host) {
            host = req.body.host;
            settings.set(id, 'host', host);
          }
          var urls = {
            auth: {
              ack: host + '/' + prefix + '/auth/ack'
            },
            jssdk: {
              config: host + '/' + prefix + '/jssdk/config'
            },
            oauth: {
              access: host + '/' + prefix + '/oauth/access',
              success: host + '/' + prefix + '/oauth/success',
              redirect: host + '/page/oauth'
            },
            pay: {
              callback: host + '/' + prefix + '/pay/callback',
              redirect: host + '/page/pay'
            }
          };
          settings.set(id, 'urls', urls);
          data.urls = urls || {auth: {}, oauth: {}, pay: {}};
          break;
        case 'app':
          if (Object.keys(req.body).length !== 0) {
            id = req.body.id;
            session.set(null, 'id', id);
            data.updated = false;
            settings.set(id, type, req.body);
          }
      }
    }

    if (Object.keys(req.body).length !== 0) {
      data.updated = true;
    }
    var file = 'config/' + type;
    data.host = host;
    data.type = type;
    data.urls = settings.get(id, 'urls') || {};
    data[type] = settings.get(id, type) || {};
    res.render(file, data);
  });
  return router;
}


export default [{
  path: '/weixin',
  router: api()
}, {
  path: '/page',
  router: template()
}, {
  path: '/config',
  router: config()
}];
