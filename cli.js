#!/usr/bin/env node
'use strict';
var meow = require('meow');
var nodeWeixinExpress = require('./');

var cli = meow({
  help: [
    'Usage',
    '  node-weixin-express [--port port] [--token token] [--id id] [--secret secret] [--host host]',
    '',
    'Example',
    '  node-weixin-express --port 10000 --token aasdsfsdfsf --id wx13383338ea --secret ab3ed23232323 --host http://localhost'
  ].join('\n')
});

var app = nodeWeixinExpress(cli.input, cli.flags);
var port = cli.flags['port'] || process.env.PORT || 3333;

app.listen(port, function () {
  console.log('Weixin Express Server Running on Port %s', port);
});
