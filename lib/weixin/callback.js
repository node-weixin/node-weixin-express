
var htmlTemplate = require('../template');

// Message Handlers
var authMessage = require('./auth/message');
var authEvent = require('./auth/event');

function parseMessage(message, type, handler, model) {
  var func = handler[type];
  if (typeof func === 'function') {
    func(message, model);
  } else {
    console.error(type + ' Not Found!');
  }
}

var callback = {
  _config: null,
  _models: null,
  _weixin: null,
  init: function (config, models, weixin) {
    callback._config = config;
    callback._models = models;
    weixin.onAuthEvent(callback.auth.event);
    weixin.onAuthMessage(callback.auth.message);
    weixin.onOauthAccess(callback.oauth.access);
    weixin.onOauthSuccess(callback.oauth.success);
  },
  auth: {
    event: function (message) {
      console.info('on Auth Event');
      var model = callback._models.event;
      var data = {
        message: message,
        from: message.FromUserName,
        to: message.ToUserName,
        event: message.Event,
        time: new Date()
      };
      model.create(data).then(function () {
        parseMessage(message, message.Event.toLowerCase(), authEvent,
          model);
      });
    },
    message: function (message) {
      console.info('on Auth Message');
      var model = callback._models.message;
      var data = {
        message: message,
        from: message.FromUserName,
        to: message.ToUserName,
        event: message.MsgType,
        time: new Date()
      };
      parseMessage(data, message.MsgType.toLowerCase(), authMessage,
        model);
    }
  },
  oauth: {
    access: function (/* req */) {
      console.info('on OAuth access');
    },
    success: function (req, res, data) {
      console.info('on OAuth Success');
      var template = htmlTemplate(callback._config.template);
      var html = template.render('oauth.html', data);
      res.send(html);
    }
  }
};

module.exports = callback;
