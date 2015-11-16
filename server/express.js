var serverConfig = require('../config');
var express = require('express');

module.exports = {
  prepare: function () {
    var bodyParser = require('body-parser');
    var session = require('express-session');
    var cookieParser = require('cookie-parser');
    var http = express();

    http.use(bodyParser.urlencoded({extended: false}));
    http.use(bodyParser.json());
    http.use(bodyParser.raw({type: 'text/xml'}));
    http.use(cookieParser());
    http.set('trust proxy', 1); // trust first proxy
    http.use(session({secret: 'mysecret', cookie: {maxAge: 60000}, resave: true, saveUninitialized: true}));
    return http;
  },

  parse: function (values, flags, weixin) {

    var path = require('path');
    var fs = require('fs');
    var conf = require("node-weixin-config");

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

    //Certificate
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

    var certificate = null;
    if (certPKCS12File) {
      certificate = {
        pkcs12: path.resolve(certPKCS12File),
        key: String(certKey)
      };
      certificate = {
        pfx: fs.readFileSync(path.resolve(certPKCS12File)),
        pfxKey: String(certKey)
      };
    }

    var urls = {
      access: host + '/weixin/oauth/access',
      success: host + '/weixin/oauth/success',
      redirect: redirect || host + '/weixin/oauth/redirect',
      pay: {
        callback: payUrl || host + '/weixin/pay/callback',
        redirect: host + '/weixin/pay/main'
      }
    };

    serverConfig.urls = urls;
    var router = this.initApis(app, merchant, certificate, urls);
    var http = this.prepare();
    http.use('/weixin', router);
    return http;
  },
  initApis: function(app, merchant, certificate, urls) {
    var router = express.Router();
    try {
      conf.app.init(app);
      if (app.token) {
        weixin.apis.auth(router, app);
        weixin.apis.jssdk(router, app);
        console.log('Auth Ack And JSSDK Server Ready!');
      } else {
        throw new Error("Token Not Specified");
      }
      try {
        conf.urls.oauth.init(urls);
        weixin.apis.oauth(router, app);
        console.log('OAuth Server Ready!');
        try {
          conf.merchant.init(merchant);
          console.log('Merchant Initialized!');
          try {
            conf.certificate.init(certificate.pfx, certificate.pfxKey);
            console.log('Certificate Initialized!');
            weixin.apis.pay(router, {
              app: app,
              merchant: merchant,
              certificate: certificate
            });

          } catch(e) {
            console.log('Failed to init Weixin Pay Certificate');
          }
        } catch(e) {
          console.log('Failed to init Weixin Pay Merchant!');
        }
      } catch (e) {
        console.log('Failed to init Oauth Server!');
      }
    } catch (e) {
      console.log("Pure Server Ready!, Configuration Needed!");
    }
    return router;
  },
  initPages: function() {

  }
};
