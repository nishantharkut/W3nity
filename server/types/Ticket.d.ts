declare module "../models/ticket.js" {
  import mongoose from "mongoose";

  interface TicketDocument extends mongoose.Document {
    wallet: string;
    tokenId: number;
    tokenURI: string;
    transactionHash: string;
    eventId?: mongoose.Types.ObjectId;
    mintedAt?: Date;
  }

  const Ticket: mongoose.Model<TicketDocument>;
  export default Ticket;
}
