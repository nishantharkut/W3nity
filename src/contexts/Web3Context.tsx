
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  sign: (message: string) => Promise<string | null>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // TODO: implement contract call
  const connect = async () => {
    setIsConnecting(true);
    try {
      // TODO: integrate API - Connect to MetaMask
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
        setIsConnected(true);
        console.log('Connected to MetaMask:', accounts[0]);
      } else {
        console.log('MetaMask not detected');
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
  };

  // TODO: implement contract call
  const sign = async (message: string): Promise<string | null> => {
    try {
      if (account && (window as any).ethereum) {
        const signature = await (window as any).ethereum.request({
          method: 'personal_sign',
          params: [message, account],
        });
        return signature;
      }
    } catch (error) {
      console.error('Failed to sign message:', error);
    }
    return null;
  };

  useEffect(() => {
    // Check if already connected
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        });
    }
  }, []);

  return (
    <Web3Context.Provider value={{
      account,
      isConnected,
      isConnecting,
      connect,
      disconnect,
      sign
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
