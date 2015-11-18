var serverConfig = require('../../config');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var fs = require('fs');
var conf = require("node-weixin-config");


module.exports = {
  prepare: function () {

    var http = express();

    http.use(bodyParser.urlencoded({extended: false}));
    http.use(bodyParser.json());
    http.use(bodyParser.raw({type: 'text/xml'}));
    http.use(cookieParser());
    http.set('trust proxy', 1); // trust first proxy
    http.use(session({secret: 'mysecret', cookie: {maxAge: 60000}, resave: true, saveUninitialized: true}));
    http.set('views', './views'); // specify the views directory
    http.set('view engine', 'ejs'); // register the template engine
    return http;
  },
  parseSettings: function (flags) {
    console.log(flags);

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
    serverConfig.host = host;
    host = "http://" + host;
    var urls = {
      access: host + '/weixin/oauth/access',
      success: host + '/weixin/oauth/success',
      redirect: host + '/page/oauth',
      pay: {
        callback: host + '/weixin/pay/callback',
        redirect: host + '/page/pay'
      }
    };
    serverConfig.urls = urls;
    var settings = {
      app: app,
      merchant: merchant,
      certificate: certificate,
      urls: urls
    };
    serverConfig.settings = settings;
    return settings;
  },

  parse: function (values, flags, weixin) {
    var settings = this.parseSettings(flags);

    var routers = this.initRouters(weixin, settings);
    var http = this.prepare();

    routers.forEach(function (router) {
      http.use(router.path, router.router);
    });
    return http;
  },

  initRouters: function (weixin, settings) {
    var api = this.apiRouter(weixin, settings.app, settings.merchant, settings.certificate, settings.urls);
    var template = this.templateRouter();
    var config = this.configRouter();
    return [
      {
        path: '/weixin',
        router: api,
      },
      {
        path: '/page',
        router: template
      },
      {
        path: '/config',
        router: config
      }
    ];
  },
  apiRouter: function (weixin, app, merchant, certificate, urls) {
    var router = express.Router();
    weixin.apis.auth(router, app);
    weixin.apis.jssdk(router, app);
    weixin.apis.oauth(router, app);
    weixin.apis.pay(router, {
      app: app,
      merchant: merchant,
      certificate: certificate
    });

    try {
      conf.app.init(app);
      try {
        if (app.token) {

          console.log('Auth Ack And JSSDK Server Ready!');
        } else {
          throw new Error("Token Not Specified");
        }
      } catch (e) {
        console.log("Pure Server Ready!, Configuration Needed!");
      }

      try {
        conf.urls.oauth.init(urls);
        console.log('OAuth Server Ready!');
        try {
          conf.merchant.init(merchant);
          console.log('Merchant Initialized!');
          try {
            conf.certificate.init(certificate.pfx, certificate.pfxKey);
            console.log('Certificate Initialized!');

          } catch (e) {
            console.log(e);
            console.log('Failed to init Weixin Pay Certificate');
          }
        } catch (e) {
          console.log(e);
          console.log('Failed to init Weixin Pay Merchant!');
        }
      } catch (e) {
        console.log(e);
        console.log('Failed to init Oauth Server!');
      }
    } catch (e) {
      console.log(e);
      console.log("Pure Server Ready!, Configuration Needed!");
    }
    return router;
  },
  templateRouter: function () {
    var router = express.Router();
    router.all('/jssdk', function (req, res) {
      res.render('jssdk-main', {host: serverConfig.host});
    });
    router.all('/oauth', function (req, res) {
      res.render('oauth-redirect');
    });

    router.all('/pay', function (req, res) {
      if (!serverConfig.weixin || !serverConfig.weixin.openid) {
        serverConfig.settings.urls.redirect = "/page/pay";
        res.redirect(serverConfig.settings.urls.access);
        return;
      }
      res.render('pay-main');
    });
    return router;
  },
  configRouter: function () {
    var router = express.Router();
    router.all('/:type', function (req, res) {
      var type = 'app';
      switch(req.params.type) {
        case 'app':
        case 'merchant':
        case 'oauth':
        case 'urls':
          type = req.params.type;
          break;
      }
      res.render('config', {
        type: type
      });
    });
    return router
  }
};
