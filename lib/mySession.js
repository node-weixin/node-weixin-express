var _ = require('lodash');
var session = require('node-weixin-session');

var stock = {
  oauth: {
    state: 'STATE',
    scope: 0,
    host: null,
    redirect: null
  },
  app: {
    id: null,
    secret: null,
    token: null
  },
  merchant: null,
  certificate: null,
  urls: {
    auth: {
      ack: null
    },
    oauth: {
      access: null,
      success: null,
      redirect: null
    },
    jssdk: {
      config: null
    },
    pay: {
      callback: null,
      redirect: null
    }
  }
};

var sessionConf = {
  default: _.clone(stock)
};

function getSessionConf(req, key, next) {
  if (!req) {
    req = {
      session: {
        __appId: 'default'
      }
    };
  }
  var id = req.session ? req.session.__appId : null;
  if (!id) {
    return next(null);
  }
  if (sessionConf[id] && sessionConf[id][key]) {
    return next(sessionConf[id][key]);
  }
  return next(sessionConf.default[key]);
}

function setSessionConf(req, key, value, next) {
  if (!req) {
    req = {
      session: {
        __appId: 'default'
      }
    };
  }
  var id = req.session.__appId;

  if (!sessionConf[id]) {
    sessionConf[id] = _.clone(stock);
  }
  sessionConf[id][key] = value;
  next();
}

session.registerSet(setSessionConf);
session.registerGet(getSessionConf);

export default session;
