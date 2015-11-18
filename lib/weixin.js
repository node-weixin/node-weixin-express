var weixin = require('node-weixin-api');
var config = require('../config');
var order = require('./order');
var errors = require('web-errors').errors;

module.exports = {
  apis: {
    auth: function (router, app) {
      router.all('/auth/ack', function (req, res) {
        var data = weixin.auth.extract(req.query);
        weixin.auth.ack(app.token, data, function (error, data) {
          if (!error) {
            res.send(data);
            return;
          }
          if (data.key) {
            res.send(errors.INPUT_INVALID);
            return;
          }
          switch (data) {
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
        var settings = config.settings;
        var url = weixin.oauth.createURL(app.id, settings.urls.success, config.oauth.state, config.oauth.scope);
        res.redirect(url);
      });
      router.all('/oauth/success', function (req, res) {
        var settings = config.settings;
        var code = req.query.code;
        if (!code) {
          res.redirect(settings.urls.access);
          return;
        }
        weixin.oauth.success(app, code, function (error, json) {
          if (error) {
            res.redirect(settings.urls.access);
            return;
          }
          var wx = {};
          wx.openid = json.openid;
          wx.accessToken = json.access_token;
          wx.refreshToken = json.refresh_token;
          config.weixin = wx;
          res.redirect(settings.urls.redirect);
        });
      });
    },
    jssdk: function (router, app, auth) {
      router.all('/jssdk/config', function (req, res) {
        var url = req.query.url;
        weixin.jssdk.prepare(app, weixin.auth, url, function (error, data) {
          if (error) {
            return res.json({});
          }
          return res.json({
            code: errors.SUCCESS.code,
            message: errors.SUCCESS.message,
            data: data
          });
        });
      });
    },
    pay: function (router, conf) {
      router.all('/pay/init', function (req, res) {
        var ip = req.headers['x-forwarded-for'] ||
          (req.connection ? req.connection.remoteAddress : null) || req.ip;
        var ips = ip.split(',');
        ip = ips[0];
        var data = order.create(config.weixin.openid, ip, config.urls.pay.callback);
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
          var prepayData = weixin.pay.prepay(conf.app, conf.merchant, prepayId);
          res.json(
            {
              code: errors.SUCCESS.code,
              message: errors.SUCCESS.message,
              data: prepayData
            });
        });
      });
      router.all('/weixin/pay/callback', function (req, res) {
        weixin.pay.callback.notify(req, res, function (error, data) {
          order.onPaid(error, data);
          res.end();
        });
      });
    }
  }
};

