#!/usr/bin/env node
'use strict';
var meow = require('meow');
var nodeWeixinExpress = require('./');

var cli = meow({
  help: [
    'Usage',
    '  node-weixin-express [--port port] [--token token]',
    '',
    'Example',
    '  node-weixin-express --port 10000 --token aasdsfsdfsf'
  ].join('\n')
});

nodeWeixinExpress(cli.input, cli.flags);
