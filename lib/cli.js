//#!/usr/bin/env node

var meow = require('meow');
var path = require('path');
var express = require('express');


var cli = meow({
  help: [
    'Usage',
    '  weixin [--port 333] [--host http://localhost]',
    'Example',
    '  weixin --port 10000 --host http://localhost'
  ].join('\n')
});
var server = require('./server/express');

var port = cli.flags.port || process.env.PORT || 3333;
var host = cli.flags.host || process.env.HOST || 'http://localhost';
var prefix = cli.flags.prefix || process.env.PREFIX || 'weixin';
var http = server.prepare();

var dir = path.resolve(__filename);
var statics = path.resolve(path.dirname(dir), 'statics');
var views = path.resolve(path.dirname(dir), 'views');

http.use('/assets', express.static(statics));
http.set('views', views);

http.set('view engine', 'ejs'); // register the template engine


http.get('/', function(req, res) {
  res.render('index', {host: host});
});

server.initCallbacks();

var app = server.start(port, host, prefix, http);

app.listen(port, function () {
  console.log('Weixin Express Server Running on Port %s', port);
});
