import React from 'react';
import { useTokenCounter } from '@/hooks/useTokenCounter';

interface Props {
  className?: string;
}

/**
 * Component to display the current token counter from the EventTicketNFT contract
 */
export default function TokenCounterDisplay({ className = '' }: Props) {
  const { counter, loading, error, refresh } = useTokenCounter();

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
        <span className="text-gray-600">Loading token count...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-red-600">Error: {error}</span>
        <button
          onClick={refresh}
          className="text-indigo-600 hover:text-indigo-800 underline text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-gray-700 font-medium">Total Tickets Minted:</span>
      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-bold">
        {counter}
      </span>
      <button
        onClick={refresh}
        className="text-gray-500 hover:text-gray-700 text-sm"
        title="Refresh"
      >
        🔄
      </button>
    </div>
  );
}
