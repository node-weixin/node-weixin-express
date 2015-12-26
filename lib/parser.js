import fs from 'fs';
import path from 'path';
var util = require('./util/urls');

export default function (settings, file) {
  let config = fs.readFileSync(file);
  let json = null;
  let id = null;

  try {
    json = JSON.parse(config);
  } catch(e) {
    console.error(e);
    return false;
  }

  if (json.app && json.app.id) {
    id = json.app.id;
  } else {
    console.error('id is not specified');
    return false;
  }
  settings.set(id, 'app', json.app);
  settings.set(id, 'oauth', json.oauth);
  settings.set(id, 'merchant', json.merchant);
  settings.set(id, 'message', json.message);

  settings.set(id, 'certificate', {
    pfx: fs.readFileSync(path.resolve(json.certificate.file)),
    pfxKey: json.certificate.key
  });

  var host = json.server.host || 'localhost';
  var prefix = json.server.prefix || 'weixin';

  var urls = util.generate(util.base(host, id), prefix);
  settings.set(id, 'host', host);
  settings.set(id, 'urls', urls);
  return id;
}
