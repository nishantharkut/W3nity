const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  actionTitle: String,     // e.g., "New proposal received"
  context: String,         // e.g., "React Dashboard"
  status: String,          // pending, completed, upcoming, etc.
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Activity", activitySchema);
