import mongoose from "mongoose";
const { Schema } = mongoose;


const messageSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Sender can be a staff or admin
        required: function () {
            return this.senderType !== 'system';  // senderId is required unless the sender is the system
        }
    },
    senderType: {
        type: String,
        enum: ['staff', 'admin', 'system'],  // Identifies if the message is from a staff, admin, or system
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // The message recipient is always a user (staff/admin)
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,  // Default to unread when a message is created
    },
    createdAt: {
        type: Date,
        default: Date.now,  // Automatically set the creation date
    }
});

// Optional: Add an index to optimize fetching unread messages
messageSchema.index({ recipientId: 1, isRead: 1 });

const Message = mongoose.model('Message', messageSchema);

export {Message}