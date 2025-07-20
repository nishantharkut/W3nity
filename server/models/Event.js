const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["hackathon", "workshop", "conference", "networking", "webinar"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: {
      type: {
        type: String,
        enum: ["online", "physical", "hybrid"],
        required: true,
      },
      address: { type: String, required: true },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    maxAttendees: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    isOnline: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
