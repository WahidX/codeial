const mongoose = require('mongoose');

const reset_tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
    isvalid: {
        type: Boolean,
        required: true
    }
},{
    timestamps: true
});

const Reset_Token = mongoose.model('Reset_Token', reset_tokenSchema);

module.exports = Reset_Token;