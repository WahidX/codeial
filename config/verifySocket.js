const jwt = require('jsonwebtoken');
const User = require('../models/users');
const env = require('./environment');

module.exports.verifySocket = async function (socket, next) {
  let token = socket.handshake.query.token;

  try {
    // Verifying the token
    const verified = jwt.verify(token, env.jwt_secret);
    let user = await User.findById(verified._id);

    if (user) {
      console.log('NEW Connection: ', user.name, ' connected');
      return next();
    } else {
      console.log('err1');
      return next(new Error('authentication error'));
    }
  } catch (err) {
    console.log('err2', err);
    return next(new Error('authentication error'));
  }
};
