'use strict';
module.exports = function (values, flags) {
  var port = flags['port'] || process.env.PORT || 3333;
  var token = flags['token'] || process.env.TOKEN || 'token';
  var express = require('express');
  var app = express();

  var routes = require('./routes');

  for(var key in routes) {
    app.get(key, routes[key](token)).post(key, routes[key](token));
  }

  var server = app.listen(port, function () {
    var port = server.address().port;
    console.log('Weixin Express Server Running on Port %s', port);
  });
  return server;
};
