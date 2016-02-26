import fs from 'fs';
import path from 'path';
import async from 'async';

var util = require('./util/urls');

export default function(settings, file, next) {
  let config = fs.readFileSync(file);
  let json = null;
  let id = null;

  try {
    json = JSON.parse(config);
  } catch (e) {
    console.error(e);
    next(false);
    return;
  }

  if (json.app && json.app.id) {
    id = json.app.id;
  } else {
    console.error('id is not specified');
    next(false);
    return;
  }

  async.series([
    (cb) => {
      settings.set(id, 'app', json.app, cb);
    }, (cb) => {
      settings.set(id, 'oauth', json.oauth, cb);
    }, (cb) => {
      settings.set(id, 'merchant', json.merchant, cb);
    }, (cb) => {
      settings.set(id, 'message', json.message, cb);
    }, (cb) => {
      settings.set(id, 'certificate', {
        pfx: fs.readFileSync(path.resolve(json.certificate.file)),
        pfxKey: json.certificate.key
      }, cb);
    }, (cb) => {
      var host = json.server.host || 'localhost';
      settings.set(id, 'host', host, cb);
    }, (cb) => {
      var host = json.server.host || 'localhost';
      var prefix = json.server.prefix || 'weixin';
      var urls = util.generate(util.base(host, id), prefix);
      settings.set(id, 'urls', urls, cb);
    }
  ], function() {
    next(id);
  });
}
