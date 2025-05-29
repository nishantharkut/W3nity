import { ethers } from "ethers";
import EventTicketNFTABI from "../artifacts/contracts/EventTicketNFT.sol/EventTicketNFT.json"; // ✅ correct ABI
const contractAddress = "0x8f7B988e984B5d32744bC5FDbB901503C416F0D8"; // ✅ your deployed contract

export const mintTicket = async (tokenURI: string) => {
if (!window.ethereum) throw new Error("MetaMask not found");

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(contractAddress, EventTicketNFTABI.abi, signer);

const txData = await contract.mintTicket.populateTransaction(tokenURI);

const tx = await signer.sendTransaction({
to: contractAddress,
data: txData.data
});

await tx.wait();
return tx.hash;
};