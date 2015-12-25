var express = require('express');
var weixin = require('node-weixin-router');
var Router = express.Router;


export default function api() {
  var router = new Router({mergeParams: true});
  weixin.init(router);
  return router;
}
