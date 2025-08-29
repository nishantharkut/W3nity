import { ethers } from "ethers";
import EventTicketNFTABI from "../artifacts/contracts/EventTicketNFT.sol/EventTicketNFT.json"; // ✅ correct ABI
const contractAddress = "0x8f7B988e984B5d32744bC5FDbB901503C416F0D8"; // ✅ your deployed contract

// Custom error types
export const TICKET_NFT_ERRORS = {
  INVALID_OWNER_ADDRESS: "EventTicketNFT__InvalidOwnerAddress",
  INVALID_RECIPIENT_ADDRESS: "EventTicketNFT__InvalidRecipientAddress",
  EMPTY_TOKEN_URI: "EventTicketNFT__EmptyTokenURI"
} as const;

export const mintTicket = async (tokenURI: string) => {
  if (!window.ethereum) throw new Error("MetaMask not found");
  
  // Validate tokenURI before sending transaction
  if (!tokenURI || tokenURI.trim().length === 0) {
    throw new Error("Token URI cannot be empty");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, EventTicketNFTABI.abi, signer);

  try {
    const txData = await contract.mintTicket.populateTransaction(tokenURI);

    const tx = await signer.sendTransaction({
      to: contractAddress,
      data: txData.data
    });

    await tx.wait();
    return tx.hash;
  } catch (error: any) {
    // Handle custom contract errors
    if (error.reason) {
      if (error.reason.includes(TICKET_NFT_ERRORS.EMPTY_TOKEN_URI)) {
        throw new Error("Token URI cannot be empty");
      }
    }
    throw error;
  }
};

/**
 * Get the current token counter from the contract
 * @returns Promise<number> The current token counter value
 */
export const getTokenCounter = async (): Promise<number> => {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, EventTicketNFTABI.abi, provider);

  try {
    const counter = await contract.getTokenCounter();
    return Number(counter);
  } catch (error) {
    console.error("Error getting token counter:", error);
    throw error;
  }
};

/**
 * Mint a ticket to a specific address (owner only)
 * @param to - The address to mint the ticket to
 * @param uri - The metadata URI for the ticket
 * @returns Promise<string> The transaction hash
 */
export const safeMint = async (to: string, uri: string): Promise<string> => {
  if (!window.ethereum) throw new Error("MetaMask not found");
  
  // Validate inputs
  if (!to || to.trim().length === 0) {
    throw new Error("Recipient address cannot be empty");
  }
  if (!uri || uri.trim().length === 0) {
    throw new Error("Token URI cannot be empty");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, EventTicketNFTABI.abi, signer);

  try {
    const txData = await contract.safeMint.populateTransaction(to, uri);

    const tx = await signer.sendTransaction({
      to: contractAddress,
      data: txData.data
    });

    await tx.wait();
    return tx.hash;
  } catch (error: any) {
    // Handle custom contract errors
    if (error.reason) {
      if (error.reason.includes(TICKET_NFT_ERRORS.INVALID_RECIPIENT_ADDRESS)) {
        throw new Error("Invalid recipient address");
      }
      if (error.reason.includes(TICKET_NFT_ERRORS.EMPTY_TOKEN_URI)) {
        throw new Error("Token URI cannot be empty");
      }
    }
    throw error;
  }
};