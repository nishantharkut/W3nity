// models/Proposal.js
const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    proposedBudget: Number,
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proposal", proposalSchema);
