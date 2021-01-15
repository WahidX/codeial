module.exports.chatSocket = function (socketServer) {
  const io = require('socket.io')(socketServer, {
    cors: {
      origin: '*',
      headers: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New connection! ', socket.id);

    socket.on('init', ({ status }) => {
      console.log('Online Status: ', status);
    });

    socket.on('disconnect', () => {
      console.log('User had left!');
    });
  });

  return io;
};
