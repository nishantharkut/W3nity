import { ethers } from "ethers";
import EscrowABI from "./Escrow.json";

export const getEscrowInstance = (
  providerOrSigner: ethers.Provider | ethers.Signer,
  contractAddress: string
) => {
  return new ethers.Contract(contractAddress, EscrowABI.abi, providerOrSigner);
};
