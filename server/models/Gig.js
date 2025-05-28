const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['AI/ML', 'App Development', 'Data Science', 'Design', 'Web Development', 'Other'], // include it here
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
      required: true,
    },
    skills: [{ type: String }],
    minBudget: Number,
    maxBudget: Number,
    budgetType: String,
    deadline: { type: Date, required: true },
    duration: String,
    deliverables: String,
    requirements: String,
    attachments: [String],
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
