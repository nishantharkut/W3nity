const mongoose=require("mongoose")

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentType: { type: String, enum: ['event_ticket', 'gig_payout'], required: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentMethod: { type: String, enum: ['stripe', 'web3'], required: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    metadata: mongoose.Schema.Types.Mixed,
    stripeSessionId: String,
    transactionHash: String,
    blockNumber: Number,
    walletAddress: String,
  },
  { timestamps: true }
);

module.exports= mongoose.model('Payment', PaymentSchema);
