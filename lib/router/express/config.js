var express = require('express');
var Router = express.Router;
var session = require('../../mySession');
var settings = require('../../mySettings');
var fs = require('fs');
var async = require('async');

var toURLs = require('../../util/urls').generate;

function certificate(req, res, type, host) {
  var value = req.body;
  req.file('pfx').upload(function (error, files) {
    var id = req.params.__appId;
    var realConf = {pfxKey: value.key};
    if (files && files.length) {
      var content = fs.readFileSync(files[0].fd);
      value.pfx = content;
      value.pfxBase64 = new Buffer(content, 'binary').toString('base64');
    }
    realConf.pfx = content;
    settings.set(id, type, realConf, function () {
      var data = {};
      var file = 'config/' + type;
      data.id = id;
      data.updated = true;
      data.hostname = host;
      data.type = type;

      settings.get(id, 'urls', function (urls) {
        data.urls = urls || {};
        data[type] = value;
        data.nav = 'config';
        res.render(file, data);
      });
    });
  });
}


export default function config() {
  var router = new Router({mergeParams: true});
  router.all('/:type', function (req, res) {
    var id = req.params.__appId;
    var data = {};
    var baseUrl = null;
    var prefix = null;
    var host = null;
    var typeData = null;
    var type = req.params.type;

    data.updated = false;
    data.id = id;

    async.series([(cb) => {
      session.set(req, 'id', id, cb);
    }, (cb) => {
      settings.get(id, 'host', function (h) {
        if (!h || Object.keys(h).length === 0) {
          h = 'localhost';
        }
        baseUrl = 'http://' + h + '/' + id + '/';
        cb();
      });
    }, (cb) => {
      session.get(req, 'prefix', function (prefixSaved) {
        prefix = prefixSaved;
        if (typeof prefix !== 'string') {
          prefix = 'weixin';
          session.set(req, 'prefix', prefix, cb);
        } else {
          cb();
        }
      });
    }, (cb) => {
      settings.get(id, 'urls', function (urls) {
        data.urls = urls || {};

        cb();
      });
    }, (cb) => {
      if (type === 'host') {
        if (req.body.host) {
          baseUrl = 'http://' + req.body.host + '/' + id + '/';
        }
        data.urls = toURLs(baseUrl, prefix);
        return settings.set(id, 'host', req.body.host || host, function () {
          settings.set(id, 'urls', data.urls, cb);
        });
      }
      cb();
    }, (cb) => {
      settings.get(id, type, function (typeDataSaved) {
        typeData = typeDataSaved || {};
        cb();
      });
    }, (cb) => {
      if (Object.keys(req.body).length !== 0) {
        data.updated = true;
        if (!req.body.host) {
          for (var k in req.body) {
            typeData[k] = req.body[k];
          }
          return settings.set(id, type, req.body, cb);
        }
      }
      cb();
    }], () => {
      switch (req.params.type) {
        case 'app':
          if (req.method === 'POST') {
            req.body.id = id;
          }
          break;
        case 'host':
          data.urls.auth = data.urls.auth || {};
          data.urls.oauth = data.urls.oauth || {};
          data.urls.pay = data.urls.pay || {};
          break;
        case 'certificate':
          if (req.method === 'POST') {
            return certificate(req, res, type, host);
          } else {
            data.hostname = host;
            data.type = type;
            var store = typeData;
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

      var file = 'config/' + type;
      data.hostname = host;
      data.type = type;
      data[type] = typeData;
      data.nav = 'config';
      res.render(file, data);
    });
  });

  return router;
}
