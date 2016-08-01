
var handler = {
  subscribe: function (message, model) {
    console.log('on event subscribe');
    console.log(message, model);
  },
  unsubscribe: function (message, model) {
    console.log('on event unsubscribe');
    console.log(message, model);
    model.create(message).then(function (data) {
      console.log(data);
    });
  },
  scan: function (message, model) {
    console.log('on event scan');
    console.log(message, model);
  },
  location: function (message, model) {
    console.log('on event location');
    console.log(message, model);
  },
  click: function (message, model) {
    console.log('on event click');
    console.log(message, model);
  },
  view: function (message, model) {
    console.log('on event view');
    console.log(message, model);
  },
  templatesendjobfinish: function (message, model) {
    console.log('on event templatesendjobfinish');
    console.log(message, model);
  }
};

module.exports = handler;
