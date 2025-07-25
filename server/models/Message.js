const mongoose = require ('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    room: {
        type: String,
        default: 'global',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    isPrivate: {
        type: Boolean, 
        default: false,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    isRead: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });
module.exports =mongoose.model('Message', messageSchema);