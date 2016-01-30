
var settings = require('../../mySettings');
var async = require('async');


export default function (req, res, next) {
  var id = req.params.__appId;
  if (!id) {
    return res.redirect('/');
  }
  var data = {};
  var keys = [{key: 'app', value: 'app'}, {key: 'urls', value: 'host'},
    {key: 'oauth', value: 'oauth'}, {key: 'merchant', value: 'merchant'},
    {key: 'certificate', value: 'certificate'}];
  async.detect(keys, function(kv, cb) {
    settings.get(id, kv.key, function (value) {
      if (!value) {
        res.redirect('/' + id + '/config/' + kv.value);
        cb(true);
        return;
      }
      data[kv.key] = value;
      cb(null);
    });
  }, function() {
    next(data.urls);
  });
}
