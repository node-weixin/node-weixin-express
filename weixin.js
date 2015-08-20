
module.exports = {
  init: {
    auth: function(http, token) {
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

