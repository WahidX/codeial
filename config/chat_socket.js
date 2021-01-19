const Chat = require('../models/chat');
const Online = require('../models/online');
const User = require('../models/users');
const verifySocket = require('./verifySocket');

let socket;

module.exports.chatSocket = function (socketServer) {
  const io = require('socket.io')(socketServer, {
    cors: {
      origin: '*',
      headers: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use(verifySocket.verifySocket); // verifying JWT token

  io.on('connect', (socketConnection) => {
    socket = socketConnection;
    socket.on('init', ({ uid }) => {
      init(uid);
    });

    // disconnect events
    socket.on('disconnect', () => {
      disconnectHandler();
    });

    // other events
    socket.on('send-message', ({ msg, uid }) => {
      //room id needed
      sendMessage(msg, uid);
    });

    socket.on('typing', typing);
    socket.on('stopped-typing', stopTyping);
  });

  return io;
};

let init = async (uid) => {
  try {
    socket.broadcast.emit('online', uid);

    // finding existing sockets
    let onlineExisting = await Online.findOne({ user: uid });
    if (onlineExisting) {
      onlineExisting.remove();
      // send logout action to existing socket
      // io.to(socketID).emit('logout');
    }

    // Creating new socket instance in DB
    let onlineInstance = await Online.create({
      user: uid,
      socket: socket.id,
    });

    // find user -> emit online status to chats
    let user = await User.findById(uid);
    if (user === null) {
      console.log('no user found');
      return;
    }
    user.chats.map((chat) => {
      socket.to(chat.roomid).emit('online', { uid });
    });
  } catch (err) {
    console.log('ERR: ', err);
    return;
  }
};

let disconnectHandler = async () => {
  // get the online instance
  let onlineInstance = await Online.findOne({ socket: socket.id });
  if (onlineInstance) {
    console.log('User had left! ', onlineInstance.user);

    // For now to everyone
    socket.broadcast.emit('offline', onlineInstance.user);

    // find user -> emit offline status to chats
    let user = await User.findById(onlineInstance.user);
    if (user === null) {
      console.log('no user found');
      return;
    }
    user.chats.map((chat) => {
      socket.to(chat.roomid).emit('offline', { uid });
    });

    onlineInstance.remove();
  }
};

let sendMessage = (msg, uid) => {
  console.log('MSGS: ', msg);
  console.log('uid: ', uid);
};

let typing = () => {
  console.log('Typing');
};

let stopTyping = () => {
  console.log('Stopped Typing');
};

// let userId = socket.handshake.query.userId; // GET USER ID

//   // CHECK IS USER EXHIST
//   if (!users[userId]) users[userId] = [];

//   // PUSH SOCKET ID FOR PARTICULAR USER ID
//   users[userId].push(socket.id);

//   // USER IS ONLINE BROAD CAST TO ALL CONNECTED USERS
//   io.sockets.emit("online", userId);

//   // DISCONNECT EVENT
//   socket.on('disconnect', (reason) => {

//     // REMOVE FROM SOCKET USERS
//     _.remove(users[userId], (u) => u === socket.id);
//     if (users[userId].length === 0) {
//       // ISER IS OFFLINE BROAD CAST TO ALL CONNECTED USERS
//       io.sockets.emit("offline", userId);
//       // REMOVE OBJECT
//       delete users[userId];
//     }
