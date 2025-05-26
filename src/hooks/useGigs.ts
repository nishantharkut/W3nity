
import { useState, useEffect } from 'react';

export interface Gig {
  id: string;
  title: string;
  description: string;
  budget: number;
  skills: string[];
  deadline: string;
  clientName: string;
  status: 'open' | 'in-progress' | 'completed';
  proposals: number;
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  category: string;
}

export const useGigs = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: integrate API
    const fetchGigs = async () => {
      try {
        setLoading(true);
        // Mock data for now
        const mockGigs: Gig[] = [
          {
            id: '1',
            title: 'React Developer for E-commerce Platform',
            description: 'Build a modern e-commerce platform with React and TypeScript',
            budget: 5000,
            skills: ['React', 'TypeScript', 'Node.js'],
            deadline: '2024-02-15',
            clientName: 'TechCorp Inc.',
            status: 'open',
            proposals: 12,
            experienceLevel: 'intermediate',
            category: 'web-development'
          },
          {
            id: '2',
            title: 'Smart Contract Developer',
            description: 'Develop and deploy smart contracts for DeFi protocol',
            budget: 8000,
            skills: ['Solidity', 'Web3', 'Ethereum'],
            deadline: '2024-03-01',
            clientName: 'CryptoVentures',
            status: 'open',
            proposals: 8,
            experienceLevel: 'expert',
            category: 'blockchain'
          }
        ];
        setGigs(mockGigs);
      } catch (err) {
        setError('Failed to fetch gigs');
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  const createGig = async (gigData: Omit<Gig, 'id' | 'proposals' | 'status'>) => {
    // TODO: integrate API
    console.log('Creating gig:', gigData);
  };

  const updateGig = async (id: string, updates: Partial<Gig>) => {
    // TODO: integrate API
    console.log('Updating gig:', id, updates);
  };

  return {
    gigs,
    loading,
    error,
    createGig,
    updateGig
  };
};
