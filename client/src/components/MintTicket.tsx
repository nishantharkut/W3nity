import React from "react";
import { mintTicket } from "@/lib/ticketNFT";

interface Props {
  tokenURI: string;
  onMintSuccess: (txHash: string) => void;
}

export default function MintTicket({ tokenURI, onMintSuccess }: Props) {
  const handleMint = async () => {
    try {
      const txHash = await mintTicket(tokenURI);
      alert(`✅ Ticket minted! TX: ${txHash}`);
      onMintSuccess(txHash); // notify parent
    } catch (err) {
      console.error("Minting failed:", err);
      alert("Minting failed. Check console.");
    }
  };

  return (
    <button
      onClick={handleMint}
      className="bg-indigo-600 text-white px-4 py-2 rounded-xl w-full"
    >
      Mint NFT Ticket
    </button>
  );
}
