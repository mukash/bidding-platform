const socketIo = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

module.exports = {
  initializeSocket,
  io,
};
