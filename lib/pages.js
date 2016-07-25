var htmlTemplate = require('./template');
function handler(name, config
  /* settings, session*/
) {
  var template = htmlTemplate(config);
  return function (req, res) {
    switch (name) {
      // case 'pay':
      //   settings.set(config.app.id, 'urls', config.urls, function () {
      //     session.get(req, 'openid', function (openid) {
      //       if (!openid || !openid.openid) {
      //         res.redirect(config.urls.oauth.access);
      //         return;
      //       }
      //       var html = template.render(name + '.html', config);
      //       res.send(html);
      //     });
      //   });
      //   break;
      case 'jssdk':
      case 'oauth':
      default:
        var html = template.render(name + '.html', config);
        res.send(html);
    }
  };
}
module.exports = function pages(app, config, settings, session) {
  app.all('/jssdk', handler('jssdk', config, settings, session));
  app.all('/oauth', handler('oauth', config, settings, session));
  app.all('/pay', handler('pay', config, settings, session));
  app.all('/', handler('index', config, settings, session));
};
