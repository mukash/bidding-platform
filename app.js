require('dotenv').config();
const express = require('express');
const http = require('http');
const itemsRouter = require('./routes/items');
const bidsRouter = require('./routes/bids');
const clientRouter = require('./routes/clients');
const { Server } = require('socket.io');
const path = require('path')


const app = express();
const server = http.createServer(app);
const io = new Server(server);

//Socket added
io.on('connection', (socket) => {
  // bidding-on-item emitted from from frontend
  socket.on('bidding-on-item', (biddingData) => {
    io.emit('new-bit', biddingData)
  });
});
// Middleware
app.use(express.json());
app.use(express.static(path.resolve("./public")));
app.get('/', (req, res)=>{
  return res.sendFile("/public/index.html")
})
// Routes
app.use('/', itemsRouter);
app.use('/', bidsRouter);
app.use('/', clientRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
