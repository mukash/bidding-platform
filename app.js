require('dotenv').config();
const express = require('express');
const http = require('http');
const socket = require('./sockets');
const itemsRouter = require('./routes/items');
const bidsRouter = require('./routes/bids');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
socket.initializeSocket(server);

// Middleware
app.use(express.json());

// Routes
app.use('/', itemsRouter);
app.use('/', bidsRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
