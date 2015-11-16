var weixin = require('node-weixin-api');
var config = require('./config');
var order = require('./lib/order');
var _ = require("lodash");

module.exports = {
  apis: {
    auth: function (router, app) {
      router.all('/auth/ack', function (req, res) {
        weixin.auth.ack(app.token, req, res, function (error, data) {
          if (!error) {
            res.send(data);
            return;
          }
          switch (data) {
            case 1:
              res.send(errors.INPUT_INVALID);
              break;
            case 2:
              res.send(errors.SIGNATURE_NOT_MATCH);
              break;
            default:
              res.send(errors.UNKNOWN_ERROR);
              break;
          }
        });
      });
    },
    oauth: function (router, app) {
      router.all('/oauth/access', function (req, res) {
        var url = weixin.oauth.createURL(app.id, config.urls.success, config.state, config.scope);
        res.redirect(url);
      });
      router.all('/oauth/success', function (req, res) {
        var code = req.param('code');
        if (!code) {
          res.redirect(config.urls.access);
          return;
        }
        weixin.oauth.success(app, code, function (error, json) {
          if (error) {
            res.redirect(config.urls.access);
            return;
          }
          var wx = {};
          wx.openid = json.openid;
          wx.accessToken = json.access_token;
          wx.refreshToken = json.refresh_token;
          config.weixin = wx;
          res.redirect(config.urls.redirect);
        });
      });
    },
    jssdk: function (router, app) {
      router.all('/jssdk/config', function (req, res) {
        var url = req.body.url;
        weinxin.jssdk.prepare(app, url, function (error, data) {
          if (error) {
            return res.json({});
          }
          return res.json(data);
        });
      });
    },
    pay: function (router, conf) {
      router.all('/pay/init', function (req, res) {
        if (!config.weixin || !config.weixin.openid) {
          res.setHeader('referer', config.urls.pay.redirect);
          res.redirect(config.urls.access);
          return;
        }
        var ip = req.headers['x-forwarded-for']
          || (req.connection ? req.connection.remoteAddress : null)
          || req.ip;
        var ips = ip.split(',');
        ip = ips[0];
        var data = order.create(config.weixin.openid, ip, urls.pay.callback);
        weixin.pay.api.order.unified(conf, data, function (error, pay) {
          if (error) {
            res.json(
              {
                code: errors.ERROR.code,
                message: errors.ERROR.message,
                data: error
              }
            );
            return;
          }
          var prepayId = pay.prepay_id;
          var prepayData = weixin.pay.prepay(app, merchant, prepayId);
          res.json(
            {
              code: errors.SUCCESS.code,
              message: errors.SUCCESS.message,
              data: prepayData
            });
        });
      });
      router.all('/weixin/pay/callback', function (req, res) {
        pay.init(app, merchant, certificate, urls);
        return function (req, res) {
          pay.notify(req, res, function(error, data) {
            console.log(error, data);
            res.end();
          });
        };
      })
    }
  },
  init: {
    auth: function (http, token) {
      var auths = require('./routes/auth');
      for (var key in auths) {
        http.all(key, auths[key](token));
      }
    },
    oauth: function (http, app, urls) {
      var oauths = require('./routes/oauth');

      function onOauthSuccess(req, res) {
        //Redirect to user defined page.
        res.redirect(urls.redirect);
      }

      for (var k in oauths) {
        http.all(k, oauths[k](app, urls, onOauthSuccess));
      }
    },
    jssdk: function (http, app, url, restApi) {
      var jssdk = require('./routes/jssdk');
      for (var k in jssdk) {
        http.all(k, jssdk[k](app, url, restApi));
      }
    },
    pay: function (http, app, merchant, certificate, urls, restApi) {
      var pay = require('./routes/pay');

      for (var k in pay) {
        http.all(k, pay[k](app, merchant, certificate, urls, restApi));
      }
    }
  }
};

