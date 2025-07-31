// utils/logActivity.js
const Activity = require("../models/Activity");

const logActivity = async ({ userId, actionTitle, context, status}) => {
  try {
    const activity = new Activity({
      userId,
      actionTitle,
      context,
      status,
    });
    await activity.save();
  } catch (err) {
    console.error("Error logging activity:", err.message);
  }
};

module.exports = logActivity;
