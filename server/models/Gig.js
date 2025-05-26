const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "web-development",
        "mobile-development",
        "blockchain",
        "ai-ml",
        "design",
        "devops",
      ],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
      required: true,
    },
    projectLength: String, // e.g., "1-3 months", "3-6 months", etc.
    projectType: String, // e.g., "Fixed Price" or "Hourly"F
    skills: [{ type: String }],
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },
    clientName: { type: String, required: true }, // used in UI for display
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proposal" }],
    status: {
      type: String,
      enum: ["open", "in progress", "completed"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gig", gigSchema);
