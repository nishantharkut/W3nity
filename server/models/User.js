// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["freelancer", "client", "organizer"] },
    bio: String,
    location: String,
    skills: [String],
    socialLinks: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
