var express = require('express');
var Router = express.Router;
var session = require('../../mySession');
var settings = require('../../mySettings');


function jssdk(req, res) {
  var id = req.params.id;
  var urls = settings.get(id, 'urls');
  res.render('pages/jssdk-main', urls);
}

function oauth(req, res) {
  var id = req.params.id;
  var urls = session.get(id, 'urls');
  res.render('pages/oauth-redirect', urls);
}

function pay(req, res) {
  var openid = session.get(req, 'openid');
  if (!openid || !openid.openid) {
    var urls = session.get(req, 'urls');
    res.redirect(urls.oauth.access);
    return;
  }
  res.render('pages/pay-main');
}

export default function pages() {
  var router = new Router({mergeParams: true});
  router.all('/jssdk', jssdk);
  router.all('/oauth', oauth);
  router.all('/pay', pay);
  return router;
}
