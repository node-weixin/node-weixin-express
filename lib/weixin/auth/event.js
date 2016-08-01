
var handler = {
  subscribe: function (message) {
    console.log('on event subscribe');
    console.log(message);
  },
  unsubscribe: function (message) {
    console.log('on event unsubscribe');
    console.log(message);
  },
  scan: function (message) {
    console.log('on event scan');
    console.log(message);
  },
  location: function (message) {
    console.log('on event location');
    console.log(message);
  },
  click: function (message) {
    console.log('on event click');
    console.log(message);
  },
  view: function (message) {
    console.log('on event view');
    console.log(message);
  },
  templatesendjobfinish: function (message) {
    console.log('on event templatesendjobfinish');
    console.log(message);
  }
};

module.exports = handler;
