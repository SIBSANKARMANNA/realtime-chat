const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../frontend/public')));



io.on('connection', (socket) => {
  console.log('A user connected');

  let username;
  let currentRoom;

  // Handle setting username
  socket.on('set username', (name) => {
      username = name;
      socket.broadcast.emit('user connected', `${username} has joined the chat.`);
  });

  // Handle joining a chat room
  socket.on('join room', (room) => {
      if (currentRoom) {
          socket.leave(currentRoom); // Leave previous room if any
      }
      currentRoom = room;
      socket.join(room); // Join the new room
      socket.emit('chat message', { user: 'System', text: `You have joined the room: ${room}` });
      socket.broadcast.to(room).emit('chat message', { user: 'System', text: `${username} has joined the room.` });
  });

  // Handle chat messages
  socket.on('chat message', (msg) => {
      if (currentRoom) {
          io.to(currentRoom).emit('chat message', { user: username, text: msg });
      } else {
          socket.emit('chat message', { user: 'System', text: 'Please join a room first.' });
      }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
      if (username && currentRoom) {
          socket.broadcast.to(currentRoom).emit('user disconnected', `${username} has left the room.`);
      }
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

