module.exports = {
  '/weixin/oauth/access': function(app, urls) {
    var oauth = require('../lib/oauth');
    return function(req, res) {
      var state = 'status';

      //0 表示 基本信息
      //1 表示 用户信息
      var scope = 0;
      oauth.init(app, urls);
      oauth.setAccess(state, scope);
      oauth.access(req, res);
    };
  },
  '/weixin/oauth/success': function(app, urls, cb) {
    var oauth = require('../lib/oauth');
    return function(req, res) {

      var code = req.param('code');
      var state = req.param('state');
      if (!code) {
        res.redirect(this.urls.access);
        return;
      }
      oauth.init(app, urls);
      oauth.setSuccess(code, state)
      oauth.success(req, res, function(error, json) {
        if (error) {
          res.redirect(this.urls.access);
          return;
        }
        var weixin = {};
        weixin.openid = json.openid;
        weixin.accessToken = json.access_token;
        weixin.refreshToken = json.refresh_token;
        req.session.weixin = weixin;
        if (cb) {
          cb(weixin);
        }
      });
    };
  },
};
