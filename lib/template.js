/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var fs = require('fs');
var path = require('path');
var nunjucks = require('nunjucks');
var assert = require('assert');

module.exports = function (template, file, config) {
  var templatePath;
  var renderer;
  var realFile;

  if (template) {
    templatePath = path.resolve(template);
    if (!fs.lstatSync(templatePath).isDirectory()) {
      templatePath = path.resolve(process.cwd(), template);
      if (!fs.lstatSync(templatePath).isDirectory()) {
        throw new Error('No File or Dir Error');
      }
    }
  } else {
    templatePath = 'views';
    templatePath = path.resolve(__dirname, templatePath);
  }
  assert(templatePath);
  console.log(templatePath);
  console.log(file);
  if (file) {
    realFile = path.join(templatePath, file);
  }
  nunjucks.configure({
    autoescape: true
  });
  if (realFile && fs.existsSync(realFile)) {
    renderer = nunjucks.configure(
      templatePath,
      {
        watch: true
      }
    );
    return renderer.render(file, config);
  }

  renderer = nunjucks.configure(
    path.resolve(__dirname, 'views'),
    {
      watch: true
    }
  );
  return renderer.render('404.html');
};

