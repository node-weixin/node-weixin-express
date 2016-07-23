// var express = require('express');
// var Router = express.Router;
// var session = require('../../mySession');
// var settings = require('../../mySettings');

// var check = require('./check');

// function jssdk(req, res) {
//   check(req, res, function (urls) {
//     urls.id = req.params.__appId;
//     urls.nav = 'pages';
//     res.render('pages/jssdk', urls);
//   });
// }

// function oauth(req, res) {
//   check(req, res, function (urls) {
//     urls.id = req.params.__appId;
//     urls.nav = 'pages';
//     res.render('pages/oauth', urls);
//   });
// }

// function pay(req, res) {
//   check(req, res, function (urls) {
//     urls.id = req.params.__appId;
//     urls.nav = 'pages';
//     urls.oauth.redirect = urls.pay.redirect;
//     settings.set(req.params.__appId, 'urls', urls, function () {
//       session.get(req, 'openid', function (openid) {
//         if (!openid || !openid.openid) {
//           res.redirect(urls.oauth.access);
//           return;
//         }
//         res.render('pages/pay-main', urls);
//       });
//     });
//   });
// }

// function index(req, res) {
//   check(req, res, function (urls) {
//     urls.id = req.params.__appId;
//     urls.nav = 'pages';
//     res.render('pages/index', urls);
//   });
// }

// export default function pages(app) {
//   var router = new Router({mergeParams: true});
//   router.all('/jssdk', jssdk);
//   router.all('/oauth', oauth);
//   router.all('/pay', pay);
//   router.all('/', index);
//   return router;
// }
