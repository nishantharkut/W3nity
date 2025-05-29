import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { ethers } from "ethers";
import mongoose from "mongoose";
import Ticket from "../models/ticket.js";
const EventTicketNFTABI = require("../abi/EventTicketNFT.json");


dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
console.log("🎯 NFT Contract Address:", process.env.NFT_CONTRACT_ADDRESS);
const contract = new ethers.Contract(
  process.env.NFT_CONTRACT_ADDRESS,
  EventTicketNFTABI.abi,
  provider
);

// DB connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: "w3nity"
}).then(() => {
  console.log("🟢 Connected to MongoDB");
}).catch(console.error);

// Event listener
contract.on("TicketMinted", async (to, tokenId, tokenURI, event) => {
  console.log("🎫 TicketMinted:", { to, tokenId: tokenId.toString(), tokenURI });

  try {
    await Ticket.create({
      wallet: to,
      tokenId: parseInt(tokenId),
      tokenURI,
      transactionHash: event.transactionHash,
    });
    console.log("✅ Ticket saved to DB");
  } catch (err) {
    console.error("❌ Error saving ticket:", err);
  }
});
