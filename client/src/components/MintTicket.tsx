import React from "react";
import { mintTicket, TICKET_NFT_ERRORS } from "@/lib/ticketNFT";

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
    } catch (err: any) {
      console.error("Minting failed:", err);
      
      // Show user-friendly error messages
      let errorMessage = "Minting failed. Please try again.";
      
      if (err.message) {
        if (err.message.includes("Token URI cannot be empty")) {
          errorMessage = "Please provide a valid token URI for the ticket.";
        } else if (err.message.includes("MetaMask not found")) {
          errorMessage = "Please install MetaMask to mint tickets.";
        } else if (err.message.includes("User denied")) {
          errorMessage = "Transaction was cancelled by user.";
        } else {
          errorMessage = err.message;
        }
      }
      
      alert(`❌ ${errorMessage}`);
    }
  };

  return (
    <button
      onClick={handleMint}
      className="bg-indigo-600 text-white px-4 py-2 rounded-xl w-full hover:bg-indigo-700 transition-colors"
      disabled={!tokenURI || tokenURI.trim().length === 0}
    >
      Mint NFT Ticket
    </button>
  );
}
