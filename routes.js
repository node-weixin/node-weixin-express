module.exports = {
  '/weixin/ack': function(token) {
    var auth = require('./lib/auth');
    return function(req, res) {
      auth.ack(token, req, res);
    };
  }
};
