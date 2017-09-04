
// should auto fetch messages if any new


const app = {};

app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
app.defaultRequest = {"order": "-createdAt", "limit" : 500};
app.friends = new Set();

//onload function
app.init = () => {
  
  app.fetch(app.defaultRequest);
  $('#send').submit(app.handleSubmit);
  $('#roomSelect').on('change', app.selectRoom);
  $(document).on('click', '.username', app.handleUsernameClick);
  app.updateChat();
};

app.send = (message, callback, room) => {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: (data) => {
      $('#chat_input').val('');
      callback(app.defaultRequest, room);

    },
    error: (data) => {
      
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = (data, roomName = 'lobby') => {
  $.ajax({
    url: app.server,
    data: data,
    type: 'GET',
    success: (data) => {
      app.mostRecent = data.results[0];
      app.processMessages(data, roomName);
    }
  });
};

app.processMessages = (messages, room) => {
  let rooms = {};
  app.clearMessages();
  app.switchRooms(room);
  app.renderRoom('create new room');
  messages.results.forEach((message) => {
    let currentRoomName = message.roomname;
    if (!rooms[currentRoomName] && currentRoomName !== null & currentRoomName !== '') {
      rooms[currentRoomName] = true;
      app.renderRoom(currentRoomName);
    }
    if (currentRoomName === room) {
      if (message.text !== '') {
        app.renderMessage(message);
      }
    }
  });
  $('#roomSelect').val(room);
};

//clear messages from chat
app.clearMessages = () => {
  $('#chats').html('');
};

//render messages to add to chat
app.renderMessage = (message) => {
  let $chatMessage = $('<div class="chat_message"></div>');
  let  $message = $('<span></span>');
  let $username = $('<a href="#" class="username"></a>');
  $username.text(message.username).html();
  $message.text(`: ${message.text}`).html();
  $chatMessage.append($username);
  $chatMessage.append($message);
  $('#chats').append($chatMessage);
};

//add rooms to dropdown menu
app.renderRoom = (room) => {
  let $room = $('<option class="room"></option>');
  $room.text(room).html();
  $room.val(room).html();
  $('#roomSelect').append($room);
};

//switch rooms when selected in dropdown
app.switchRooms = (room) => { 
  $('#currentRoom').text(room).html();
};

//on selection of room from dropdown.
app.selectRoom = (event) => {
  event.preventDefault();
  let room = event.target.value;
  if (room === 'create new room') {
   app.addRoom(room);
  }
  app.fetch(app.defaultRequest, room);
};

//add room to DOM
app.addRoom = (room) => {
  let answer = prompt('What would you like to call it?');
  let data = {
    text: '',
    username: app.username,
    roomname: answer
  };
  app.send(data, app.fetch, answer);

};

//add friend to friendlist on click of friend
app.handleUsernameClick = (event) => {
  let friend = event.target.innerText;
  app.friends.add(friend);

};

//write messages to chat and send to server
app.handleSubmit = (event) => {
  event.preventDefault();
  
  let $message = $('#chat_input').val(); 
  let $room = $('#currentRoom').text();
  
  let data = {
    text: $message,
    username: app.username,
    roomname: $room
  };
  //change callback;
  app.send(data, app.fetch, $room);
};

//get current username
app.getUsername = () => {
  let username = window.location.href.match(/username=(.+)$/);
  username = username[1];
  return username;
};


app.updateChat = () => {
 app.interval = setInterval(() => {
  app.fetch(app.defaultRequest, $('#roomSelect').text())}, 3000);  
};

app.username = app.getUsername();


app.init();