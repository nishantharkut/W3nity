// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    media: String // optional image or file
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
