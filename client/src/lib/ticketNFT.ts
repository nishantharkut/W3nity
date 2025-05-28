import { ethers } from "ethers";
import EventTicketABI from "./EventTicketABI.json";

// Replace this after deploy
const CONTRACT_ADDRESS = "0xYourDeployedAddress";

export const mintTicket = async (
  recipient: string,
  eventId: number,
  tokenURI: string
) => {
  if (!window.ethereum) throw new Error("MetaMask not detected");

  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, EventTicketABI, signer);

  const tx = await contract.mintTicket(recipient, eventId, tokenURI);
  await tx.wait();

  return tx.hash;
};
