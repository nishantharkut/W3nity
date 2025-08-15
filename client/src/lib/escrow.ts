import { ethers } from "ethers";
import EscrowABI from "./Escrow.json";

export const getEscrowInstance = (
  providerOrSigner: ethers.Provider | ethers.Signer,
  contractAddress: string
) => {
  return new ethers.Contract(contractAddress, EscrowABI.abi, providerOrSigner);
};

// Helper function to parse escrow contract errors
export const parseEscrowError = (error: any): string => {
  if (error?.reason) {
    if (error.reason.includes("Escrow__NotClient")) {
      return "Only the client can perform this action.";
    } else if (error.reason.includes("Escrow__FundsAlreadyReleased")) {
      return "Funds have already been released.";
    } else if (error.reason.includes("Escrow__InsufficientBalance")) {
      return "Insufficient balance in the contract.";
    } else if (error.reason.includes("Escrow__EtherTransferFailed")) {
      return "Failed to transfer Ether.";
    } else if (error.reason.includes("Escrow__NoEtherSent")) {
      return "No Ether was sent with the transaction.";
    } else if (error.reason.includes("Escrow__InvalidFreelancerAddress")) {
      return "Invalid freelancer address provided.";
    }
    return error.reason;
  }
  
  if (error?.code === 4001) {
    return "Transaction rejected by user.";
  }
  
  return error?.shortMessage || error?.message || "Unknown error occurred.";
};

// Helper function to get contract details
export const getEscrowDetails = async (
  contract: ethers.Contract
): Promise<{
  client: string;
  freelancer: string;
  amount: bigint;
  isComplete: boolean;
  balance: bigint;
}> => {
  try {
    const [client, freelancer, amount, isComplete, balance] = await Promise.all([
      contract.i_client(),
      contract.i_freelancer(),
      contract.i_amount(),
      contract.s_isComplete(),
      contract.getBalance(),
    ]);

    return {
      client,
      freelancer,
      amount,
      isComplete,
      balance,
    };
  } catch (error) {
    throw new Error(`Failed to get contract details: ${parseEscrowError(error)}`);
  }
};
