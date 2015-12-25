var express = require('express');
var Router = express.Router;
var session = require('../../mySession');
//var settings = require('../../mySettings');

var check = require('./check');

function jssdk(req, res) {
  check(req, res, function(urls) {
    urls.id = req.params.id;
    urls.nav = 'pages';
    res.render('pages/jssdk-main', urls);
  });
}

function oauth(req, res) {
  check(req, res, function(urls) {
    urls.id = req.params.id;
    urls.nav = 'pages';
    res.render('pages/oauth-redirect', urls);
  });
}

function pay(req, res) {
  check(req, res, function(urls) {
    urls.id = req.params.id;
    urls.nav = 'pages';
    var openid = session.get(req, 'openid');
    if (!openid || !openid.openid) {
      res.redirect(urls.oauth.access);
      return;
    }
    res.render('pages/pay-main', urls);
  });
}

function index(req, res) {
  check(req, res, function(urls) {
    urls.id = req.params.id;
    urls.nav = 'pages';
    res.render('pages/index', urls);
  });
}

export default function pages() {
  var router = new Router({mergeParams: true});
  router.all('/jssdk', jssdk);
  router.all('/oauth', oauth);
  router.all('/pay', pay);
  router.all('/index', index);
  return router;
}
