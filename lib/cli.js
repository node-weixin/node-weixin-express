#!/usr/bin/env node
'use strict';
var cmd = require('./cmd');

cmd.start(function(app) {
  console.log('Weixin Server is Starting');
});
