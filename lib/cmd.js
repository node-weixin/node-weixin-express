var meow = require('meow');
var fs = require('fs');
var path = require('path');
var express = require('express');


var cli = meow({
  help: [
    'Usage',
    '  weixin [--port 3333] [--host http://localhost]',
    'Example',
    '  weixin --port 10000 --host http://localhost'
  ].join('\n')
});
var server = require('./server/express');
var parser = require('./parser');
var settings = require('./mySettings');

var port = cli.flags.port || process.env.PORT || 3333;
var host = cli.flags.host || process.env.HOST || 'localhost';
var prefix = cli.flags.prefix || process.env.PREFIX || 'weixin';
var config = cli.flags.config;

var http = server.prepare();

var dir = path.resolve(__filename);
var statics = path.resolve(path.dirname(dir), 'statics');
var views = path.resolve(path.dirname(dir), 'views');

http.use(require('skipper')());
http.use('/assets', express.static(statics));
http.use(function(req, res, next) {
  next();
});

http.set('views', views);


http.set('view engine', 'ejs'); // register the template engine


http.get('/', function(req, res) {
  var data = {};
  data.id = req.params.__appId;
  data.nav = '/';
  data.host = host;
  res.render('index', data);
});

server.initCallbacks();

function startServer(next) {
  server.start(port, host, prefix, http, function() {
    if (!cli.flags.test) {
      http.listen(port, function() {
        next(http);
        console.log('Weixin Express Server Running on Port %s', port);
      });
    } else {
      next(http);
    }
  });
}

function start(next) {
  if (config) {
    var configFile = path.resolve(config);
    if (fs.existsSync(configFile)) {
      parser(settings, configFile, function () {
        startServer(next);
      });
    }
  } else {
    startServer(next);
  }
}

module.exports = {
  http: http,
  start: function(cb) {
    start(cb);
  }
};
