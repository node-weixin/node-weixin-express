/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var fs = require('fs');
var path = require('path');
var nunjucks = require('nunjucks');

module.exports = function (config) {
  var templatePath = config.template || 'views';
  templatePath = path.resolve(__dirname, templatePath);
  if (!fs.existsSync(templatePath)) {
    throw new Error('No File or Dir Error');
  }

  nunjucks.configure({
    autoescape: true
  });

  return nunjucks.configure(
    templatePath,
    {
      watch: true
    }
  );
};
