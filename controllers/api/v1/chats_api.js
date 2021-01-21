const Chat = require('../../../models/chat');
const Online = require('../../../models/chat');
const Message = require('../../../models/message');
const User = require('../../../models/users');

module.exports.getChats = async function (req, res) {
  try {
    let user = await User.findById(req.user.id).populate({
      path: 'chats',
      populate: {
        path: 'users',
        select: '_id name email avatar',
      },
    });

    return res.status(200).json({
      message: 'Success',
      chats: user.chats,
    });
  } catch (err) {
    console.log('Err: ', err);
    return res.status(501).json({
      message: 'Internal Server Error',
    });
  }
};

module.exports.getMessages = async function (req, res) {
  try {
    if (!req.params.roomid) {
      return res.status(501).json({
        message: 'Room ID missing',
      });
    }

    let messages = await Message.find({
      room: req.params.roomid,
    });

    return res.status(200).json({
      message: 'Success',
      messages,
    });
  } catch (err) {
    console.log('Err: ', err);
    return res.status(501).json({
      message: 'Internal Server Error',
    });
  }
};
