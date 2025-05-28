import React from "react";
import { getEventNFTContract } from "../utils/getEventNFTContract";

export default function MintTicket() {
  const handleMint = async () => {
    try {
      const contract = await getEventNFTContract();
      const tx = await contract.mintTicket(
        "0xEe9B179cA16Cb4e6E9c89B3B586a8f484d2b656c",
        "https://ipfs.io/ipfs/YourTokenMetadata.json",
        123
      );
      await tx.wait();
      alert("🎉 Ticket minted!");
    } catch (err) {
      console.error("Minting failed:", err);
      alert("Minting failed. Check console.");
    }
  };

  return (
    <button
      onClick={handleMint}
      className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
    >
      Mint NFT Ticket
    </button>
  );
}
