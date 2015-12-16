var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var conf = require('node-weixin-config');
var Router = express.Router;

var parser = require('../cli-parser');

//var weixinSession = {};


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

  start: function (flags, weixin) {
    var settings = parser(flags);

    var routers = this.initRouters(weixin, settings);
    var http = this.prepare();

    routers.forEach(function (router) {
      http.use(router.path, router.router);
    });
    return http;
  },

  initRouters: function (weixin, settings) {
    var api = this.apiRouter(weixin, settings);
    var template = this.templateRouter();
    var config = this.configRouter();
    return [
      {
        path: '/weixin',
        router: api
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
  apiRouter: function (weixin, appConfig) {
    var router = new Router();
    weixin.init(router, appConfig);

    try {
      conf.app.init(appConfig.app);
      try {
        if (appConfig.app.token) {
          console.log('Auth Ack And JSSDK Server Ready!');
        } else {
          throw new Error('Token Not Specified');
        }
      } catch (e) {
        console.log('Pure Server Ready!, Configuration Needed!');
      }

      try {
        conf.urls.oauth.init(appConfig.urls);
        console.log('OAuth Server Ready!');
        try {
          conf.merchant.init(appConfig.merchant);
          console.log('Merchant Initialized!');
          try {
            conf.certificate.init(appConfig.certificate.pfx, appConfig.certificate.pfxKey);
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
      console.log('Pure Server Ready!, Configuration Needed!');
    }
    return router;
  },
  templateRouter: function (appConfig) {
    var router = new Router();
    router.all('/jssdk', function (req, res) {
      res.render('jssdk-main', {host: appConfig.host});
    });
    router.all('/oauth', function (req, res) {
      res.render('oauth-redirect');
    });

    router.all('/pay', function (req, res) {
      if (!req.session._weixin || !session._weixin.openid) {
        appConfig.urls.redirect = '/page/pay';
        res.redirect(appConfig.urls.access);
        return;
      }
      res.render('pay-main');
    });
    return router;
  },
  configRouter: function () {
    var router = new Router();
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
    return router;
  }
};
