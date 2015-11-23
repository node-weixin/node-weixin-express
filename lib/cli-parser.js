var path = require('path');
var fs = require('fs');
var serverConfig = require('./config');

module.exports = function(flags) {


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
}
