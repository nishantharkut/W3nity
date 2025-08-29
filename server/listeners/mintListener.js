const { ethers } = require("ethers");
const mongoose = require("mongoose");
require("dotenv").config();

const Ticket = require("../models/ticket");
const abi = require("../abi/EventTicketNFT.json").abi;

async function main() {
  // Connect to MongoDB
  await mongoose.connect("mongodb://127.0.0.1:27017/w3nity");

  const provider = new ethers.JsonRpcProvider(
    `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
  );
  const contract = new ethers.Contract(
    process.env.NFT_CONTRACT_ADDRESS,
    abi,
    provider
  );

  contract.on("TicketMinted", async (to, tokenId, tokenURI, event) => {
    console.log(`🎟 New Ticket Minted: ${tokenId} for ${to}`);

    const ticket = new Ticket({
      walletAddress: to,
      tokenId: tokenId.toString(),
      tokenURI,
      transactionHash: event.transactionHash,
    });

    await ticket.save();
    console.log("✅ Saved ticket to DB");
  });
}

main().catch((err) => {
  console.error("❌ Error in mint listener:", err);
});
