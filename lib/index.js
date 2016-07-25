'use strict';
var router = require('./weixin');
module.exports = function (cb, app, config, prefix) {
  router(function (weixin) {
    cb(weixin, app);
  }, app, config, prefix);
};
