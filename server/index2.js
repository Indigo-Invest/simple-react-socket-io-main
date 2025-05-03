//adding typing event
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Setup CORS and Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  },
  maxHttpBufferSize: 1e6 // 1MB limit (default), adjust if needed
});

// Middleware
app.use(cors());

// Example root route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('message', (data) => {
    console.log(`Message received: ${data}`);
    // Broadcast the message to all connected clients
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 9013;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

