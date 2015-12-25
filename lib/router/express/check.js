
var settings = require('../../mySettings');


export default function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res.redirect('/');
  }
  var pairs = {
    app: 'app',
    urls: 'host',
    oauth: 'oauth',
    merchant: 'merchant',
    certificate: 'certificate'
  };
  var data = {};

  for(var k in pairs) {
    data[k] = settings.get(id, k);
    if (!data[k]) {
      console.error('key ' + k + ' not set');
      return res.redirect('/' + id + '/config/' + pairs[k]);
    }
  }
  next(data.urls);
}
