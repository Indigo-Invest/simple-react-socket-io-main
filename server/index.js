const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle any other routes and return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

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

