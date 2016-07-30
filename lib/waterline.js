var Waterline = require('waterline');
var waterline = new Waterline();
var models = require('./models/');
for (var i = 0; i < models.length; i++) {
  var connection = Waterline.Collection.extend(models[i]);
  waterline.loadCollection(connection);
}

var callback = function (cb) {
  return function (error, ontology) {
    if (error) {
      console.error(error);
      cb(error, ontology);
      return;
    }
    cb(error, ontology);
  };
};

module.exports = {
  init: function (config, cb) {
    waterline.initialize(config, callback(cb));
  },
  callback: callback
};
