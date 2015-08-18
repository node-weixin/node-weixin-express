module.exports = {
  '/weixin/auth/ack': function (token) {
    var auth = require('../lib/auth');
    return function (req, res) {
      auth.ack(token, req, res);
    };
  }
};
