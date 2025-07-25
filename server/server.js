// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// MongoDB Connection
const connectDB = require('./config/config.js');
connectDB();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Shared memory for demo purposes (can be replaced by DB logic)
const users = {};
const messages = [];
const typingUsers = {};

// Socket.io modular event controller
const handleSocketEvents = require('./controllers/socketController');

io.on('connection', (socket) => {
  handleSocketEvents(io, socket, users, messages, typingUsers);
});

const activityHandler = require('./socket/events/activity'); // adjust path as needed

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  activityHandler(io, socket); // plug in your custom activity tracking

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// API routes
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
// Mount user routes
app.use('/api/users', userRoutes);

const authMiddleware = require('./middlewares/authMiddleware.js');


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };