var express = require('express');
var Router = express.Router;
var session = require('../../mySession');
var settings = require('../../mySettings');
var fs = require('fs');

function toURLs(baseUrl, prefix) {
  return {
    auth: {
      ack: baseUrl + prefix + '/auth/ack'
    },
    jssdk: {
      config: baseUrl + prefix + '/jssdk/config'
    },
    oauth: {
      access: baseUrl + prefix + '/oauth/access',
      success: baseUrl + prefix + '/oauth/success',
      redirect: baseUrl + 'page/oauth'
    },
    pay: {
      callback: baseUrl + prefix + '/pay/callback',
      redirect: baseUrl + 'page/pay'
    }
  };
}

function parseHost(req, baseUrl, id, prefix) {
  if (req.body.host) {
    var host = req.body.host;
    settings.set(id, 'host', host);
    baseUrl = 'http://' + host + '/' + id + '/';

  }

  var urls = toURLs(baseUrl, prefix);
  settings.set(id, 'urls', urls);
  return urls;
}

function pay(req, id, type) {
  req.file('pfx').upload((function (appId) {
    return function (error, files) {
      var value = settings.get(appId, 'pay') || {};
      if (files && files.length) {
        var content = fs.readFileSync(files[0].fd);
        content = new Buffer(content, 'binary').toString('base64');
        value.pfx = content;
      }
      settings.set(appId, 'pay', value);
    };
  })(id));
  settings.set(id, type, req.body);
}


export default function config() {
  var router = new Router({mergeParams: true});
  router.all('/:type', function (req, res) {
    var id = req.params.id;
    if (!id) {
      res.redirect('/');
      return;
    }
    session.set(req, 'id', id);

    var data = {};
    var urls = null;
    data.updated = false;
    data.id = id;
    var host = settings.get(id, 'host');
    if (!host || Object.keys(host).length === 0) {
      host = 'localhost';
    }
    var baseUrl = 'http://' + host + '/' + id + '/';
    var prefix = session.get(req, 'prefix') || 'weixin';

    var type = req.params.type;

    if (id) {
      switch (req.params.type) {
        case 'app':
          if (req.method === 'POST') {
            req.body.id = id;
          }
          break;
        case 'host':
          urls = parseHost(req, baseUrl, id, prefix);
          data.urls = urls || {auth: {}, oauth: {}, pay: {}};
          break;
        case 'pay':
          if (req.method === 'POST') {
            pay(req, id, type);
          }
          break;
      }
    }

    if (Object.keys(req.body).length !== 0) {
      data.updated = true;
      if (!req.body.host) {
        if (req.params.type !== 'pay') {
          settings.set(id, type, req.body);
        }
      }
    }
    var file = 'config/' + type;
    data.hostname = host;
    data.type = type;
    data.urls = settings.get(id, 'urls') || {};
    data[type] = settings.get(id, type) || {};
    res.render(file, data);
  });
  return router;
}
