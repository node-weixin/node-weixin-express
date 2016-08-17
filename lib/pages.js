var htmlTemplate = require('./template');
function handler(name, config) {
  return function (req, res) {
    switch (name) {
      case 'jssdk':
      case 'oauth':
      default:
        var html = htmlTemplate(config.template, name + '.html', config);
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
