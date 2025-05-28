// models/Proposal.js
const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gig",
    required: true,
  },
  message: String,
  budget: Number,
  deliveryTime: Number, // 🆕 Optional: add delivery time
  escrowAddress: String, // 🆕 Store deployed escrow address
  status: {
    type: String,
    enum: ["Pending", "Accepted", "FundReleased"],
    default: "Pending",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Proposal", proposalSchema);
