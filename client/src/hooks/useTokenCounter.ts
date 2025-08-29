import { useState, useEffect } from 'react';
import { getTokenCounter } from '@/lib/ticketNFT';

/**
 * Hook to get and track the current token counter from the EventTicketNFT contract
 * @returns Object containing counter value, loading state, error, and refresh function
 */
export const useTokenCounter = () => {
  const [counter, setCounter] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounter = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentCounter = await getTokenCounter();
      setCounter(currentCounter);
    } catch (err: any) {
      console.error('Error fetching token counter:', err);
      setError(err.message || 'Failed to fetch token counter');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounter();
  }, []);

  return {
    counter,
    loading,
    error,
    refresh: fetchCounter
  };
};
