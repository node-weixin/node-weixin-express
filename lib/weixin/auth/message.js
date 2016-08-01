var handler = {
  text: function (message, model) {
    console.log('on message, model text');
    console.log(message, model);
  },
  image: function (message, model) {
    console.log('on message, model image');
    console.log(message, model);
  },
  voice: function (message, model) {
    console.log('on message, model voice');
    console.log(message, model);
  },
  video: function (message, model) {
    console.log('on message, model video');
    console.log(message, model);
  },
  shortvideo: function (message, model) {
    console.log('on message, model shortvideo');
    console.log(message, model);
  },
  location: function (message, model) {
    console.log('on message, model location');
    console.log(message, model);
  },
  link: function (message, model) {
    console.log('on message, model link');
    console.log(message, model);
  }
};

module.exports = handler;
