var express = require('express');
var Router = express.Router;
//var session = require('../../mySession');
//var settings = require('../../mySettings');
//var fs = require('fs');

export default function business() {
  var router = new Router({mergeParams: true});
  router.all('/:type', function (req, res) {
    var data = {};
    data.id = req.params.id;
    data.nav = 'apis';
    res.render('index', data);
  });
  return router;
}
