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
    projectLength: String,
    projectType: String,
    skills: [{ type: String }],
    minBudget: Number,
    maxBudget: Number,
    deadline: { type: Date, required: true },
    clientName: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
