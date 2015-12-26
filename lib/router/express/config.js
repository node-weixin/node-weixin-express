var express = require('express');
var Router = express.Router;
var session = require('../../mySession');
var settings = require('../../mySettings');
var fs = require('fs');

var toURLs = require('../../util/urls').generate;

//function toURLs(baseUrl, prefix) {
//  return {
//    auth: {
//      ack: baseUrl + prefix + '/auth/ack'
//    },
//    jssdk: {
//      config: baseUrl + prefix + '/jssdk/config',
//      main: baseUrl + 'pages/jssdk'
//    },
//    oauth: {
//      access: baseUrl + prefix + '/oauth/access',
//      success: baseUrl + prefix + '/oauth/success',
//      redirect: baseUrl + 'pages/oauth'
//    },
//    pay: {
//      callback: baseUrl + prefix + '/pay/callback',
//      success: baseUrl + 'pages/pay',
//      main: baseUrl + 'pages/pay',
//      error: baseUrl + 'error/pay',
//      redirect: baseUrl + 'pages/pay'
//    }
//  };
//}

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

function certificate(req, res, type, host) {
  var value = req.body;
  req.file('pfx').upload(function (error, files) {
    var id = req.params.id;
    var realConf = {pfxKey: value.key};
    if (files && files.length) {
      var content = fs.readFileSync(files[0].fd);
      value.pfx = content;
      value.pfxBase64 = new Buffer(content, 'binary').toString('base64');
    }
    realConf.pfx = content;
    settings.set(id, type, realConf);
    var data = {};
    var file = 'config/' + type;
    data.id = id;
    data.updated = true;
    data.hostname = host;
    data.type = type;
    data.urls = settings.get(id, 'urls') || {};
    data[type] = value;
    data.nav = 'config';
    res.render(file, data);
  });
}


export default function config() {
  var router = new Router({mergeParams: true});
  router.all('/:type', function (req, res) {
    var id = req.params.id;
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
    var prefix = session.get(req, 'prefix');
    if (typeof prefix !== 'string') {
      prefix = 'weixin';
      session.set(req, 'prefxi', prefix);
    }

    var type = req.params.type;

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
      case 'certificate':
        if (req.method === 'POST') {
          return certificate(req, res, type, host);
        } else {
          data.hostname = host;
          data.type = type;
          data.urls = settings.get(id, 'urls') || {};
          var store = settings.get(id, type) || {};
          data[type] = store;
          if (store.pfxKey) {
            data[type] = {
              key: store.pfxKey,
              pfxBase64: new Buffer(store.pfx, 'binary').toString('base64')
            };
          } else {
            data[type] = store;
          }
          data.nav = 'config';
          res.render('config/' + type, data);
          return;
        }
        break;
    }

    if (Object.keys(req.body).length !== 0) {
      data.updated = true;
      if (!req.body.host) {
        settings.set(id, type, req.body);
      }
    }
    var file = 'config/' + type;
    data.hostname = host;
    data.type = type;
    data.urls = settings.get(id, 'urls') || {};
    data[type] = settings.get(id, type) || {};
    data.nav = 'config';
    res.render(file, data);
  });
  return router;
}
