const mongoose = require('mongoose');

const onlineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    socket: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Online = mongoose.model('Online', onlineSchema);

module.exports = Online;
