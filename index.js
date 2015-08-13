'use strict';
module.exports = function (values, flags) {
  var port = flags['port'] || process.env.PORT || 3333;
  var express = require('express');
  var app = express();

  var routes = require('./routes');

  for(var key in routes) {
    app.get(key, routes[key]).post(key, routes[key]);
  }

  var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Weixin Express Server Running at http://%s:%s', host, port);
  });
  return server;
};
