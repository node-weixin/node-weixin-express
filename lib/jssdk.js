var jssdk = require('node-weixin-jssdk');
var errors = require('web-errors').errors;

module.exports = {
  prepare: function (app, url, restApi,res) {
    jssdk.prepare(app, url, function(error, data) {
      console.log('inside prepare 1');
      console.log(error, data);
      if (error) {
        return restApi(res, errors.ERROR, data);
      }
      restApi(res, errors.SUCCESS, data);
    });
  }
}
