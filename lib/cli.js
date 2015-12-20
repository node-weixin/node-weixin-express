//#!/usr/bin/env node

var meow = require('meow');

var cli = meow({
  help: [
    'Usage',
    '  weixin [--port 333] [--host http://localhost]',
    'Example',
    '  weixin --port 10000 --host http://localhost'
  ].join('\n')
});
var server = require('./lib/server/express');

var port = cli.flags.port || process.env.PORT || 3333;
var host = cli.flags.host || process.env.HOST || 'http://localhost';
var prefix = cli.flags.prefix || process.env.PREFIX || 'weixin';
var app = server.start(port, host, prefix);

app.listen(port, function () {
  console.log('Weixin Express Server Running on Port %s', port);
});
