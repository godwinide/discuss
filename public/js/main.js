const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const username = document.querySelector("#username").value;
const room = document.querySelector("#room").value;

const socket = io();

// notification permission
(function reqPerm(){
  Notification.requestPermission()
  .then(res => {
    if(res != ("granted")){
      alert("please allow notification");
    }
  })
})()

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  outputMessage(message);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
  playsound("message", message);
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(messages) {
  // empty the chat first
  document.querySelector('.chat-messages').innerHTML = "";
  messages.forEach(message => {
    if(!((message.type == "join" && message.text.includes(username)) || (message.type == "left" && message.text.includes(username)))){
      const div = document.createElement('div');
      div.classList.add('message');
      div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
      <p class="text">
        ${message.text}
      </p>`;
      document.querySelector('.chat-messages').appendChild(div);
    }
  })
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

// play sound
const sounds = [
  "eventually.mp3",
  "maybe-one-day.mp3",
  "open-up.mp3"
];


function playsound(evt, msgs){
  switch(evt){
      case "message":
        if(document.hidden){
            new Audio("../sounds/" + sounds[1]).play();
            const msg = msgs[msgs.length - 1];
            // send push notification
              Push.create(`${msg.username}`,{
                  body: `${msg.text}`,
                  logo: "https://admin.enaland.com/img/logo2.png",
                  onClick: function () {
                      window.focus();
                      this.close();
                  }
              });
        }
  }
}

