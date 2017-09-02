

var app = {};

app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';

app.init = function() {
  // $(document).ready(function() {
  //   $('#chatbox').submit((event) => {
  //     event.preventDefault();
  //     console.log(event);
  //   });
  // //
  // });
  
  
};

app.send = function(message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
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
  var self = this;
  $.ajax({
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    success: function (data) {
      self.processMessages(data);
      console.log('chatterbox: Message received');
    }
  });
};

app.processMessages = function(messages) {
  var self = this;
  messages.results.forEach(function(message) {
    self.renderMessage(message);
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(message) {
  var $message = $('<div></div>');
  //var $username = $('<a >')
  $message.html(`${message.username}: ${message.text}`);
  $('#chats').append($message);
};

app.renderRoom = function(room) {
  var $room = $('<div></div>');
  $room.html(room);
  $('#roomSelect').append($room);
};

app.handleUsernameClick = (event) => {
  var $username = ('<div class="username"></div>');

};