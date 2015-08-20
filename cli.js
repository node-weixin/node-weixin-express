#!/usr/bin/env node
'use strict';
var meow = require('meow');

var cli = meow({
  help: [
    'Usage',
    '  weixin [--port 333] [--id appid] [--secret appsecret] [--token apptoken] ' +
    '[--jssdk-url http://wx.domain.com/weixin/jssdk/main] [--host http://wx.domain.com] ' +
    '[--merchant-id mid]  [--merchant-key mkey] ' +
    '[--cert-file apiclient_cert.p12] [--cert-key ckey] ' +
    '[--pay-url http://wx.domian.com/weixin/pay] ' +
    '[--redirect http://wx.domain.com/weixin/pay/main]',
    '',
    'Example',
    '  weixin --port 10000 --token aasdsfsdfsf --id wx13383338ea --secret ab3ed23232323 --host http://localhost'
  ].join('\n')
});
var weixin = require('./weixin');
var express = require('./server/express');

var app = express.parse(cli.input, cli.flags, weixin);

var port = cli.flags['port'] || process.env.PORT || 3333;

app.listen(port, function () {
  console.log('Weixin Express Server Running on Port %s', port);
});
