const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['gig', 'event', 'message', 'system'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  sourceId: { type: String }, // e.g., gigId, eventId, messageId
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  actionUrl: { type: String },
  meta: { type: Object }, // for additional data
});

module.exports = mongoose.model('Notification', NotificationSchema); 