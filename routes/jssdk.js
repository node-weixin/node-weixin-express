
var jssdk = require('../lib/jssdk');
var errors = require('web-errors').errors;
var fs = require('fs'), path = require('path');

module.exports = {
  '/weixin/jssdk/config': function(app, url, restApi) {
    return function(req, res) {
      jssdk.prepare(app, url, restApi, res);
    };
  },
  '/weixin/jssdk/main': function(app) {
    return function(req, res) {
      var data = fs.readFileSync(path.resolve(__dirname, '../htmls/jssdk-main.html'));
      //res.send('Oauth Success! Please specify your url with  --redirect directive!');
      res.type("html")
      res.send(data);
    }
  }
};
