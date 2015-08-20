module.exports = {
  api: function (res, error, data) {
    var _ = require("lodash");
    var json = _.assign({}, error);
    if (data) {
      json.data = data;
    } else {
      delete json.data;
    }
    res.json(json);
  },

  ready: function () {
    var express = require('express');
    var bodyParser = require('body-parser');
    var session = require('express-session');
    var http = express();

    http.use(bodyParser.urlencoded({extended: false}));
    http.use(bodyParser.json());
    http.set('trust proxy', 1); // trust first proxy
    http.use(session({secret: 'mysecret', cookie: {maxAge: 60000}, resave: true, saveUninitialized: true}));
    return http;
  },
  parse: function (values, flags, weixin) {
    //Getting data from cli

    //Auth basic
    var id = flags['id'] || process.env.APP_ID || null;
    var secret = flags['secret'] || process.env.APP_SECRET || null;
    var token = flags['token'] || process.env.APP_TOKEN || null;

    //Oauth
    var host = flags['host'] || process.env.HOST || null;
    var redirect = flags['redirect'] || process.env.REDIRECT || null;


    //JSSDK
    var jsurl = flags['jssdkUrl'] || process.env.JSSDK_URL || null;


    //Merchant
    var merchantId = flags['merchantId'] || process.env.MERCHANT_ID || null;
    var merchantKey = flags['merchantKey'] || process.env.MERCHANT_KEY || null;

    //Certficate
    var certPKCS12File = flags['certFile'] || process.env.CERT_FILE || null;
    var certKey = flags['certKey'] || process.env.CERT_KEY || null;


    var payUrl = flags['payUrl'] || process.env.PAY_URL || null;


    //Init configuration
    var app = {
      id: id,
      secret: secret,
      token: token
    };


    var merchant = {
      id: String(merchantId),
      key: String(merchantKey)
    };

    var path = require('path');
    var certificate = null;
    if (certPKCS12File) {
      certificate = {
        pkcs12: path.resolve(certPKCS12File),
        key: String(certKey)
      };
    }
    var urls = {
      access: host + '/weixin/oauth/access',
      success: host + '/weixin/oauth/success',
      redirect: redirect || host + '/weixin/oauth/redirect',
      pay: {
        callback: payUrl || host + '/weixin/pay/callback'
      }
    };
    var http = this.ready();
    this.run(http, weixin, app, merchant, certificate, jsurl, urls);
    return http;
  },
  run: function(http, weixin, app, merchant, certificat, jsurl, urls) {
    var config = require("node-weixin-config");

    if (app.token) {
      weixin.init.auth(http, app.token);
      console.log('Auth Ack Server Ready!');
    }
    try {
      config.app.init(app);
      if (jsurl) {
        weixin.init.jssdk(http, app, jsurl);
        console.log('JSSDK Server Ready!');
      }
      try {
        config.urls.oauth.init(urls);
        weixin.init.oauth(http, app, urls);
        console.log('OAuth Server Ready!');
        try {
          config.merchant.init(merchant);
          console.log('Merchant Initialized!');
          try {
            config.certificate.init(certificate.pkcs12, certificate.key);
            console.log('Certificate Initialized!');
            try {
              weixin.init.pay(http, app, merchant, certificate, urls);
              console.log('Weixin Pay Server Ready!');
            } catch (e) {
              console.log('Failed to init Weixin Pay');
              console.log(e);
            }
          } catch (e) {
            console.log('Failed to init Weixin Pay Certificate');
            console.log(e);
          }
        } catch (e) {
          console.log('Failed to init Weixin Pay Merchant');
        }
      } catch (e) {
        console.log('Failed to init Oauth');
      }
    } catch (e) {
      console.log('Failed to init JSSDK And Oauth');
    }
    return http;
  }

};
