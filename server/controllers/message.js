import ExpressError from "../utils/ExpressError.js";
import { Message } from "../models/Message.js";
import User from "../models/User.js";
import { USER_ROLES } from "../middlewares/auth.js";

export const createMessage = async (req, res) => {
    const { senderId, recipients, message } = req.body;
    // const { lab_id } = req.user;

    // Validate that required fields are provided

    if (!recipients || !message) {
        throw new ExpressError('Missing required fields: recipients, or message', 400);
    }

    if (!senderId) {
        throw new ExpressError('Sender ID is required if sender is not system', 400);
    }

    // Ensure recipients is an array and not empty
    if (!Array.isArray(recipients) || recipients.length === 0) {
        throw new ExpressError('Recipients must be a non-empty array', 400);
    }

    let senderType;
    const sender = await User.findById(senderId);
    console.log("🚀 ~ createMessage ~ sender:", (await sender).toObject())
    if (sender.roles.includes(1923)) senderType = 'admin';
    else senderType = 'staff';
    console.log(senderType);
    for (const recepId of recipients) {
        const recipient = await User.findById(recepId);
        console.log("🚀 ~ createMessage ~ recipient:", recipient)
        if (!recipient) throw new ExpressError('Recipient(s) mus be valid user ID(s)', 400);
        if (recipient.lab_id.toString() !== sender.lab_id.toString()) throw new ExpressError('Sender and recipient lab must be same', 400);
    }



    // Create an array of message objects to save for each recipient
    const messagesToSave = recipients.map(recipientId => ({
        senderId: senderType !== 'system' ? senderId : undefined,  // Only include senderId if it's not system
        senderType,
        recipientId,  // Each recipient gets a message
        message,
        isRead: false,
        createdAt: Date.now()
    }));

    // Use Message.insertMany() to save all messages in one operation
    const savedMessages = await Message.insertMany(messagesToSave);

    // Return a success response with the created messages
    return res.status(201).json({
        message: `${recipients.length} message(s) sent successfully`,
        success: true,
        payload: savedMessages
    });
};

export const getMessages = async (req, res) => {
    const { recipientId, senderId, unread, senderType } = req.query;  // Extract query parameters
    const { roles: userRoles, _id: userId } = req.user;
    console.log("🚀 ~ getMessages ~ userId:", userId)

    // Build the query object dynamically based on the provided query parameters
    const query = {};
    if (recipientId) query.recipientId = recipientId;
    if (senderId) query.senderId = senderId;
    if (unread) query.isRead = unread === 'true' ? false : true;
    if (senderType) query.senderType = senderType;
    let populate = req.query.populate?.split(',') || [];

    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) - 1 || 0;


    if (userRoles.length === 1 && userRoles.includes(USER_ROLES.staff) && !(userId.toString() === recipientId || userId.toString() === senderId)) throw new ExpressError('Unauthorized access!', 401);

    // Find messages based on the query object
    let messages = Message.find(query)
    messages = messages.sort({ createdAt: -1 }).skip(page * limit).limit(limit);
    
    if (populate.length === 1)
        messages = await messages.populate(populate[0], '_id username name');
    if (populate.length === 2) {
        messages = messages.populate(populate[0], '_id username name');
        messages = await messages.populate(populate[1], '_id username name');
    }
    if (populate.length === 0)
        messages = await messages;

    const count = await Message.countDocuments(query);
    const totalPage = Math.ceil(count / limit) ;

    // Return the messages
    return res.status(200).json({
        message: 'Messages retrieved successfully',
        payload: {
            messages,
            perpage: limit,
            totalPage,
            currentPage: page + 1
        },
        success: true
    });
};


export const markMessageAsRead = async (req, res) => {
    const { messageId } = req.params;  // Get the message ID from the request parameters
    // const { _id: userId } = req.user;

    // if (userId !== message.senderId.toString()) throw new ExpressError('The user must be the message sender to mark it as read ', 400);
    // Find the message by ID and update the isRead field to true
    const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { isRead: true },  // Set isRead to true
        { new: true }      // Return the updated message
    );


    // Check if the message was found and updated
    if (!updatedMessage) {
        throw new ExpressError('Message not found', 404);
    }

    // Return success response with the updated message
    return res.status(200).json({
        success: true,
        payload: updatedMessage
    });
}

export const getMessage = async (req, res) => {
    const { messageId } = req.params;
    // const { _id: userId } = req.user;

    const message = Message.findById(messageId);
    if (!message) throw new ExpressError('Message not found', 400);

    // if (userId !== message.senderId.toString()) throw new ExpressError('The user must be the message sender ', 400);

    res.send({
        success: true,
        payload: message
    })
}

export const getUnreadCoun = async (req, res) => {
    const { _id: userId } = req.user;
    const count = await Message.countDocuments({
        recipientId: userId,
        isRead: false
    })
    res.send({
        success: true,
        payload: count
    })
}