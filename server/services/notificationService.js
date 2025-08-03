const Notification = require('../models/Notification');
let ioInstance = null;

// Set the Socket.io instance
exports.setSocketIoInstance = (io) => {
  ioInstance = io;
};

// Create and deliver a notification
const mongoose = require('mongoose');

exports.createAndSendNotification = async (data) => {
  try {
    if (!data.userId) throw new Error("userId is required");
    
    const notification = new Notification({
      ...data,
      userId: new mongoose.Types.ObjectId(data.userId) // ✅ Enforce ObjectId
    });

    await notification.save();

    if (ioInstance && ioInstance.sendNotificationToUser) {
      ioInstance.sendNotificationToUser(data.userId.toString(), notification);
    }

    return notification;
  } catch (err) {
    console.error('Error creating notification:', err);
    throw err;
  }
};
