/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var fs = require('fs');
var path = require('path');
var nunjucks = require('nunjucks');

module.exports = function (template) {
  var templatePath;
  if (template) {
    templatePath = path.resolve(template);
    if (!fs.existsSync(templatePath)) {
      templatePath = path.resolve(process.cwd(), template);
      if (!fs.existsSync(template)) {
        throw new Error('No File or Dir Error');
      }
    }
  } else {
    templatePath = 'views';
    templatePath = path.resolve(__dirname, templatePath);
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
