<<<<<<< HEAD
//Adding a "typing..." indicator ✍️ (when someone is typing) 
=======
//Replaced depricated methods
>>>>>>> a8792507c75aba4f1880558e5672f674ce9c0eea
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  },
});

app.use(cors());

app.get('/', (req, res) => {
  res.send('Server is running');
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('typing', (data) => {
    // Broadcast to everyone except the sender
    socket.broadcast.emit('typing', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 9013;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

