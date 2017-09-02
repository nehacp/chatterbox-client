// YOUR CODE HERE:


var app = {};

app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';

app.init = function() {
  
};

app.send = function(message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: message,
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    success: function (data) {
      //app.processMessages(data);
      console.log(data);
      console.log('chatterbox: Message received');
    }
  });
};

app.processMessages = function(messages) {
  messages.results.forEach(function(message) {
    this.renderMessage(message);
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(message) {
  var $message = $('<div></div>');
  $message.html(`${message.username}: ${message.text}`);
  $('#chats').append($message);
};

app.renderRoom = function(room) {
  var $room = $('<div></div>');
  $room.html(room);
  $('#roomSelect').append($room);
};