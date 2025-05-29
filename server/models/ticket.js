const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  wallet: { type: String, required: true },
  tokenId: { type: Number, required: true },
  tokenURI: { type: String, required: true },
  transactionHash: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  mintedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
