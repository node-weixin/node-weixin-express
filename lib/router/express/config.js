var express = require('express');
var Router = express.Router;
var session = require('../../mySession');
var settings = require('../../mySettings');
var fs = require('fs');

function parseHost(req, baseUrl, id) {
  if (req.body.host) {
    var host = req.body.host;
    settings.set(id, 'host', host);
  }
  var prefix = session.get(req, 'prefix') || 'weixin';

  //var baseUrl = 'http://' + host + '/' + id + '/';
  var urls = {
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
        pay.pfx = content;
      }
      settings.set(appId, 'pay', value);
    };
  })(id));
  settings.set(id, type, req.body);
}


export default function config() {
  var router = new Router({mergeParams: true});
  router.all('/:type', function (req, res) {
    var host = session.get(req, 'host') || '';
    var id = session.get(req, 'id');
    var data = {};
    var urls = null;
    data.updated = false;
    var baseUrl = 'http://' + host + '/' + id + '/';
    //var prefix = session.get(req, 'prefix') || 'weixin';

    var type = req.params.type;

    if (id) {
      switch (req.params.type) {
        case 'host':
          urls = parseHost(req, baseUrl, id);
          data.urls = urls || {auth: {}, oauth: {}, pay: {}};
          break;
        case 'pay':
          if (req.method === 'POST') {
            pay(req, id, type);
          }
          break;
      }
    } else {
      type = 'app';
      if (Object.keys(req.body).length !== 0) {
        id = req.body.id;
        session.set(req, 'id', id);
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
    data.host = host;
    data.type = type;
    data.urls = settings.get(id, 'urls') || {};
    data[type] = settings.get(id, type) || {};
    res.render(file, data);
  });
  return router;
}
