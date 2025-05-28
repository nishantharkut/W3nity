
import { useState, useEffect, useCallback } from 'react';
import { Web3State } from '@/types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWeb3 = () => {
  const [web3State, setWeb3State] = useState<Web3State>({
    account: null,
    isConnected: false,
    chainId: null,
    balance: null,
    isLoading: false,
    error: null,
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
          
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          
          setWeb3State({
            isConnected: true,
            account: accounts[0],
            balance: (parseInt(balance, 16) / 1e18).toFixed(4),
            chainId: parseInt(chainId, 16),
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error checking connection:', error);
        setWeb3State(prev => ({ 
          ...prev, 
          error: 'Failed to check connection',
          isLoading: false 
        }));
      }
    }
  }, []);

  const connect = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      setWeb3State(prev => ({ 
        ...prev, 
        error: 'MetaMask not installed',
        isLoading: false 
      }));
      return;
    }

    setWeb3State(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });
        
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        setWeb3State({
          isConnected: true,
          account: accounts[0],
          balance: (parseInt(balance, 16) / 1e18).toFixed(4),
          chainId: parseInt(chainId, 16),
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      setWeb3State({
        account: null,
        isConnected: false,
        chainId: null,
        balance: null,
        isLoading: false,
        error: error.message || 'Failed to connect',
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    setWeb3State({
      account: null,
      isConnected: false,
      chainId: null,
      balance: null,
      isLoading: false,
      error: null,
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