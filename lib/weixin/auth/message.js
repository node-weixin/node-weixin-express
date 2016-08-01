var handler = {
  text: function (message) {
    console.log('on message text');
    console.log(message);
  },
  image: function (message) {
    console.log('on message image');
    console.log(message);
  },
  voice: function (message) {
    console.log('on message voice');
    console.log(message);
  },
  video: function (message) {
    console.log('on message video');
    console.log(message);
  },
  shortvideo: function (message) {
    console.log('on message shortvideo');
    console.log(message);
  },
  location: function (message) {
    console.log('on message location');
    console.log(message);
  },
  link: function (message) {
    console.log('on message link');
    console.log(message);
  }
};

module.exports = handler;
