import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWeb3 = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        setError("Please install MetaMask");
        return;
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      const account = await signer.getAddress();
      const balanceBigInt = await web3Provider.getBalance(account);
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(signer);
      setAccount(account);
      setBalance(ethers.formatEther(balanceBigInt));
      setChainId(network.chainId.toString());
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to connect");
      }
    }
  }, []);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      resetState();
    } else {
      connectWallet();
    }
  }, [connectWallet]);

  const handleChainChanged = useCallback(() => {
    connectWallet();
  }, [connectWallet]);

  const resetState = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setBalance(null);
    setChainId(null);
    setError(null);
  };

  useEffect(() => {
    if (window.ethereum?.on) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  return {
    provider,
    signer,
    account,
    balance,
    chainId,
    error,
    connectWallet,
  };
};
