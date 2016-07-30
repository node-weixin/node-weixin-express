var path = require('path');
var filePath = path.resolve(process.cwd());
module.exports = {
  adapters: {
    disk: require('sails-disk')
  },

  connections: {
    default: {
      adapter: 'disk',
      filePath: filePath + '/data/'
    }
  }
};
