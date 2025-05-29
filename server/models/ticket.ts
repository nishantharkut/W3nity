// server/models/ticket.ts
import mongoose, { Schema, Document, model } from "mongoose";

export interface ITicket extends Document {
  wallet: string;
  tokenId: number;
  tokenURI: string;
  transactionHash: string;
  eventId?: mongoose.Types.ObjectId;
  mintedAt: Date;
}

const ticketSchema: Schema = new Schema({
  wallet: { type: String, required: true },
  tokenId: { type: Number, required: true },
  tokenURI: { type: String, required: true },
  transactionHash: { type: String, required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event" },
  mintedAt: { type: Date, default: Date.now }
});

// Fix for Hot Reloading (Render redeploys)
const Ticket = mongoose.models.Ticket || model<ITicket>("Ticket", ticketSchema);
export default Ticket;
