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

  setSuccess: function(code, state) {
    this.sucessCode = code;
    this.sucessState = state;
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
    console.log(url);
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
    console.log('inside success');
      oauth.success(this.app, this.sucessCode, function (error, json) {
        console.log(error, json);
        cb(error, json);
      });
  }
};
