const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['sent', 'delivered', 'seen', 'error'],
      default: 'sent',
    },
    content: {
      type: String,
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
