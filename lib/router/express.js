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
    console.log(req.body);
    console.log(req.query);
    var app = session.get(req, 'app') || {};
    if (!app.id) {
      if (req.body) {
        console.log(body);
        session.set(req, 'app', req.body);
        app = req.body;
      }
    }
    var type = 'app';
    var file = 'index';
    var data = {};
    console.log(req.params);
    switch (req.params.type) {
      case 'host':
        var host = session.get(req, 'host');
        if (req.body.host) {
          host = req.body.host;
          session.set(req, 'host', host);
          session.set(null, 'host', host);
        }
        var prefix = session.get(req, 'prefix') || 'weixin';
        console.log(prefix);
        console.log(host);
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
        session.set(req, 'urls', urls);
        session.set(null, 'urls', urls);
        data.urls = urls || {auth:{}, oauth:{}, pay: {}};
        break;
      case 'app':
      case 'merchant':
      case 'oauth':
        if (req.body) {
          session.set(req, type, req.body);
        }
        break;
    }
    var app = session.get(req, 'app') || {};
    if (!app.id) {
      type = 'app';
    } else {
      type = req.params.type;
    }
    file = 'config/' + type;


    data.host = session.get(req, 'host');
    data.urls = session.get(req, 'urls');
    data[type] = session.get(req, type);
    console.log(file);
    console.log(data);
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
