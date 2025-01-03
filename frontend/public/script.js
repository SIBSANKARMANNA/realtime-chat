
const socket = io();
let username;
let currentRoom;

// Prompt user for a username
username = prompt('Enter your username:');
if (username) {
    socket.emit('set username', username);
}

// Elements
const form = document.getElementById('chat-form');
const input = document.getElementById('message');
const messages = document.getElementById('messages');
const roomSelect = document.getElementById('rooms');
const joinRoomButton = document.getElementById('join-room');

// Submit event for the form
form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

// Listen for chat messages
socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${msg.user}</strong>: ${msg.text}`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});

// Listen for user connection notifications
socket.on('user connected', (message) => {
    const item = document.createElement('li');
    item.textContent = message;
    item.style.color = 'green';
    messages.appendChild(item);
});

// Listen for user disconnection notifications
socket.on('user disconnected', (message) => {
    const item = document.createElement('li');
    item.textContent = message;
    item.style.color = 'red';
    messages.appendChild(item);
});

// Handle room joining
joinRoomButton.addEventListener('click', () => {
    const selectedRoom = roomSelect.value;

    if (!currentRoom || currentRoom !== selectedRoom) {
        currentRoom = selectedRoom;
        socket.emit('join room', currentRoom);
    }
});
