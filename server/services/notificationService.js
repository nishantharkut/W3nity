const Notification = require('../models/Notification');
let ioInstance = null;

// Set the Socket.io instance
exports.setSocketIoInstance = (io) => {
  ioInstance = io;
};

// Create and deliver a notification
exports.createAndSendNotification = async (data) => {
  try {
    console.log('Creating notification:', data);
    const notification = new Notification(data);
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