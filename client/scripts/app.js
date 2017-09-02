

var app = {};

app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';


app.init = function() {
  
  app.fetch();


  $('.dropdown-content').on('click', (event) => {
    app.fetch(event.target.innerText);
  });


  
  $(document).on('click', '.room', function (event) {
    app.fetch(event.target.innerText);
  });


    
  $(document).submit(app.renderChatMessage);

  
  app.updateChat();
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('send return', data);
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function(roomName = 'lobby') {
//"2017-09-01T00:00:00.000Z"
  $.ajax({
    url: app.server,
    data: {"order": "-createdAt", "limit" : 500},
    type: 'GET',
    success: function (data) {
      app.mostRecent = data.results[0];
      app.switchRooms(roomName);
      app.processMessages(data, roomName);
    }
  });
};

app.processMessages = function(messages, room) {
  var rooms = {};
  $('#chats').html('');
  messages.results.forEach(function(message) {
    var currentRoomName = message.roomname;
    if (!rooms[currentRoomName]) {
      rooms[currentRoomName] = true;
      app.renderRoom(currentRoomName);
    }
    if (currentRoomName === room) {
      app.renderMessage(message);
    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(message) {
  var $message = $('<div></div>');
  $message.text(`${message.username}: ${message.text}`).html();
  $('#chats').append($message);
};

app.switchRooms = function(room) { 
  //room = room[0].toUpperCase() + room.slice(1);
  $('#roomSelect').html(room);
};

app.renderRoom = (room) => {
  var $room = $('<ul class="room"></ul>');
  var $link = $('<a href="#"></a>');
  $link.text(room);
  $room.append($link);
  $('.dropdown-content').append($room);
};

app.handleUsernameClick = (event) => {
  var $username = ('<div class="username"></div>');

};

app.dropdown = () => {
  var $allRooms = $('#myDropdown');
  $allRooms.hide();
};

app.renderChatMessage = (event) => {
  event.preventDefault();
  
  var $message = $('#chat_input').val(); 
  var $room = $('#roomSelect').text();
  
  var data = {
    text: $message,
    username: app.username,
    roomname: $room
  };

  app.send(data);
};

app.getUsername = () => {
  var username = window.location.href.match(/username=(.+)$/);
  username = username[1];
  return username;
};

app.updateChat = () => {
 // setInterval(app.fetch($('#roomSelect').text()), 1000);  
};

app.username = app.getUsername();




app.init();