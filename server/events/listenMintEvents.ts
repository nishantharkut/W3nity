// server/events/listenMintEvents.ts

import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { ethers } from "ethers";
import mongoose from "mongoose";
import Ticket from "../models/ticket";
import EventTicketNFTABI from "../abi/EventTicketNFT.json";

// Connect to Ethereum
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || "");
const contractAddress = process.env.NFT_CONTRACT_ADDRESS || "";

console.log("🎯 NFT Contract Address:", contractAddress);

// Instantiate the smart contract
const contract = new ethers.Contract(
  contractAddress,
  EventTicketNFTABI.abi,
  provider
);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "", {
  dbName: "w3nity",
})
  .then(() => console.log("🟢 Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Event listener for TicketMinted
contract.on(
  "TicketMinted",
  async (to: string, tokenId: ethers.BigNumberish, tokenURI: string, event: any) => {
    console.log("🎫 TicketMinted:", {
      to,
      tokenId: tokenId.toString(),
      tokenURI,
    });

    try {
      await Ticket.create({
        wallet: to,
        tokenId: parseInt(tokenId.toString()),
        tokenURI,
        transactionHash: event.transactionHash,
      });

      console.log("✅ Ticket saved to DB");
    } catch (err) {
      console.error("❌ Error saving ticket:", err);
    }
  }
);
