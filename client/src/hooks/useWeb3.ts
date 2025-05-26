
import { useState, useEffect, useCallback } from 'react';
import { Web3State } from '@/types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWeb3 = () => {
  const [web3State, setWeb3State] = useState<Web3State>({
    isConnected: false,
    isLoading: false,
  });

  const checkConnection = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest'],
          });
          
          const network = await window.ethereum.request({ method: 'eth_chainId' });
          
          setWeb3State({
            isConnected: true,
            account: accounts[0],
            balance: (parseInt(balance, 16) / 1e18).toFixed(4),
            network: network,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error checking connection:', error);
        setWeb3State(prev => ({ ...prev, error: 'Failed to check connection' }));
      }
    }
  }, []);

  const connect = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      setWeb3State(prev => ({ ...prev, error: 'MetaMask not installed' }));
      return;
    }

    setWeb3State(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });
        
        const network = await window.ethereum.request({ method: 'eth_chainId' });
        
        setWeb3State({
          isConnected: true,
          account: accounts[0],
          balance: (parseInt(balance, 16) / 1e18).toFixed(4),
          network: network,
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      setWeb3State({
        isConnected: false,
        isLoading: false,
        error: error.message || 'Failed to connect',
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    setWeb3State({
      isConnected: false,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    checkConnection();

    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          checkConnection();
        }
      };

      const handleChainChanged = () => {
        checkConnection();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [checkConnection, disconnect]);

  return {
    ...web3State,
    connect,
    disconnect,
  };
};
