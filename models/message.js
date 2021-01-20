const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['sent', 'delivered', 'seen', 'error'],
    },
    content: {
      type: String,
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
