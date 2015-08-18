var oauth = require('node-weixin-oauth');

module.exports = {
  init: function(app, urls) {
    this.app = app;
    this.urls = urls;
  },

  setAccess: function(state, scope) {
    this.accessState = state;
    this.accessScope = scope;
  },

  setSuccess: function(code) {
    this.sucessCode = code;
  },

  /**
   * Create oauth url
   * @param id
   * @param redirectUri
   * @param state
   * @param scope
   */
  access: function (req, res, cb) {
    var url = oauth.createURL(this.app.id, this.urls.success, this.accessState, this.accessScope);
    res.redirect(url);
  },
  /**
   * Callback when oauth success
   * @param app
   * @param accessUri
   * @param cb
   * @returns {Function}
   */
  success: function (req, res, cb) {
      oauth.success(this.app, this.sucessCode, function (error, json) {
        cb(error, json);
      });
  }
};
