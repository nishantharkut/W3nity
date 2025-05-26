import { User, Gig, Event, DashboardStats } from '@/types';
import { addDays, subDays } from 'date-fns';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'alex_dev',
    email: 'alex@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'Full-stack developer with expertise in React, Node.js, and blockchain technologies.',
    skills: ['React', 'Node.js', 'TypeScript', 'Solidity', 'PostgreSQL'],
    rating: 4.9,
    reviewCount: 87,
    isVerified: true,
    joinedAt: new Date('2022-03-15'),
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    username: 'sarah_designer',
    email: 'sarah@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio: 'UI/UX designer passionate about creating beautiful and functional user experiences.',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
    rating: 4.8,
    reviewCount: 64,
    isVerified: true,
    joinedAt: new Date('2021-11-20'),
    location: 'New York, NY',
  },
  {
    id: '3',
    username: 'mike_blockchain',
    email: 'mike@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    bio: 'Blockchain developer and smart contract specialist with 5+ years of experience.',
    skills: ['Solidity', 'Web3', 'Ethereum', 'Smart Contracts', 'DeFi'],
    rating: 5.0,
    reviewCount: 42,
    isVerified: true,
    joinedAt: new Date('2020-08-10'),
    location: 'Remote',
  },
];

export const mockChatGroups = [
  {
    id: '1',
    name: 'React Developers',
    description: 'A community for React developers to share knowledge, ask questions, and collaborate on projects.',
    type: 'public',
    members: [mockUsers[0], mockUsers[1]],
    lastActivity: subDays(new Date(), 1),
    createdAt: subDays(new Date(), 30),
  },
  {
    id: '2',
    name: 'Web3 & Blockchain',
    description: 'Discuss the latest in blockchain technology, smart contracts, and decentralized applications.',
    type: 'public',
    members: [mockUsers[0], mockUsers[2]],
    lastActivity: subDays(new Date(), 2),
    createdAt: subDays(new Date(), 45),
  },
  {
    id: '3',
    name: 'UI/UX Design Hub',
    description: 'Share design inspiration, get feedback on your work, and discuss design trends.',
    type: 'public',
    members: [mockUsers[1]],
    lastActivity: subDays(new Date(), 3),
    createdAt: subDays(new Date(), 20),
  },
  {
    id: '4',
    name: 'Freelance Tips & Tricks',
    description: 'Private group for sharing freelancing strategies and building professional networks.',
    type: 'private',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    lastActivity: new Date(),
    createdAt: subDays(new Date(), 60),
  },
];

export const mockGigs: Gig[] = [
  {
    id: '1',
    title: 'Build a DeFi Dashboard with Real-time Analytics',
    description: 'Looking for an experienced React developer to build a comprehensive DeFi dashboard that displays real-time analytics for various protocols. The dashboard should include charts, portfolio tracking, and transaction history.',
    budget: { min: 2500, max: 5000, type: 'fixed' },
    skills: ['React', 'TypeScript', 'Web3', 'Chart.js', 'API Integration'],
    experienceLevel: 'expert',
    deadline: addDays(new Date(), 30),
    status: 'open',
    client: mockUsers[0],
    proposals: [],
    createdAt: subDays(new Date(), 2),
    category: 'Web Development',
    tags: ['DeFi', 'Dashboard', 'Analytics', 'React', 'Blockchain'],
  },
  {
    id: '2',
    title: 'Mobile App UI/UX Design for Fintech Startup',
    description: 'We need a talented UI/UX designer to create a modern, intuitive mobile app design for our fintech startup. The app will focus on personal finance management and investment tracking.',
    budget: { min: 1200, max: 2500, type: 'fixed' },
    skills: ['Figma', 'Mobile Design', 'UI/UX', 'Prototyping', 'User Research'],
    experienceLevel: 'intermediate',
    deadline: addDays(new Date(), 21),
    status: 'open',
    client: mockUsers[1],
    proposals: [],
    createdAt: subDays(new Date(), 1),
    category: 'Design',
    tags: ['Mobile', 'Fintech', 'UI/UX', 'Investment', 'Finance'],
  },
  {
    id: '3',
    title: 'Smart Contract Development for NFT Marketplace',
    description: 'Seeking a Solidity expert to develop smart contracts for our NFT marketplace. The contracts should handle minting, trading, royalties, and auction functionality.',
    budget: { min: 3000, max: 6000, type: 'fixed' },
    skills: ['Solidity', 'Smart Contracts', 'Ethereum', 'OpenZeppelin', 'Testing'],
    experienceLevel: 'expert',
    deadline: addDays(new Date(), 45),
    status: 'open',
    client: mockUsers[2],
    proposals: [],
    createdAt: subDays(new Date(), 3),
    category: 'Blockchain',
    tags: ['NFT', 'Marketplace', 'Smart Contracts', 'Ethereum', 'Solidity'],
  },
  {
    id: '4',
    title: 'React Native App Development',
    description: 'Looking for a React Native developer to build a cross-platform mobile app for our food delivery service. The app should include user authentication, real-time tracking, and payment integration.',
    budget: { min: 4000, max: 8000, type: 'fixed' },
    skills: ['React Native', 'JavaScript', 'Firebase', 'Payment Integration', 'Maps API'],
    experienceLevel: 'intermediate',
    deadline: addDays(new Date(), 60),
    status: 'open',
    client: mockUsers[0],
    proposals: [],
    createdAt: subDays(new Date(), 5),
    category: 'Mobile Development',
    tags: ['React Native', 'Food Delivery', 'Mobile App', 'Cross-platform'],
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Web3 Developer Conference 2024',
    description: 'Join us for the biggest Web3 developer conference of the year! Connect with industry leaders, learn about the latest technologies, and network with fellow developers.',
    organizer: mockUsers[2],
    startDate: addDays(new Date(), 15),
    endDate: addDays(new Date(), 17),
    location: {
      type: 'physical',
      address: 'Moscone Center, San Francisco, CA',
      coordinates: { lat: 37.7849, lng: -122.4094 },
    },
    category: 'conference',
    tags: ['Web3', 'Blockchain', 'Ethereum', 'DeFi', 'NFTs'],
    maxAttendees: 500,
    currentAttendees: 347,
    price: 299,
    status: 'upcoming',
    registrations: [],
    createdAt: subDays(new Date(), 30),
  },
  {
    id: '2',
    title: 'React Workshop: Advanced Patterns and Best Practices',
    description: 'Master advanced React patterns including custom hooks, context optimization, and performance techniques. Perfect for developers looking to level up their React skills.',
    organizer: mockUsers[0],
    startDate: addDays(new Date(), 7),
    endDate: addDays(new Date(), 7),
    location: {
      type: 'online',
      meetingLink: 'https://zoom.us/meeting/123',
    },
    category: 'workshop',
    tags: ['React', 'JavaScript', 'Frontend', 'Performance', 'Patterns'],
    maxAttendees: 50,
    currentAttendees: 38,
    price: 0,
    status: 'upcoming',
    registrations: [],
    createdAt: subDays(new Date(), 14),
  },
  {
    id: '3',
    title: 'Tech Startup Networking Night',
    description: 'Connect with entrepreneurs, investors, and tech professionals in an informal networking environment. Great food, drinks, and conversations guaranteed!',
    organizer: mockUsers[1],
    startDate: addDays(new Date(), 10),
    endDate: addDays(new Date(), 10),
    location: {
      type: 'physical',
      address: 'TechHub NYC, New York, NY',
      coordinates: { lat: 40.7589, lng: -73.9851 },
    },
    category: 'networking',
    tags: ['Networking', 'Startups', 'Entrepreneurs', 'Investors', 'Tech'],
    maxAttendees: 100,
    currentAttendees: 72,
    price: 25,
    status: 'upcoming',
    registrations: [],
    createdAt: subDays(new Date(), 7),
  },
];

export const mockDashboardStats: DashboardStats = {
  freelance: {
    activeGigs: 3,
    totalProposals: 12,
    acceptanceRate: 67,
    earnings: 15420,
  },
  events: {
    registeredEvents: 5,
    hostedEvents: 2,
    upcomingEvents: 3,
  },
  community: {
    totalMessages: 1247,
    activeGroups: 8,
    connections: 156,
  },
};

// API simulation functions
export const fetchGigs = async (filters?: any): Promise<Gig[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredGigs = [...mockGigs];
  
  if (filters?.skills?.length) {
    filteredGigs = filteredGigs.filter(gig =>
      gig.skills.some(skill => filters.skills.includes(skill))
    );
  }
  
  if (filters?.experienceLevel) {
    filteredGigs = filteredGigs.filter(gig =>
      gig.experienceLevel === filters.experienceLevel
    );
  }
  
  if (filters?.category) {
    filteredGigs = filteredGigs.filter(gig =>
      gig.category === filters.category
    );
  }
  
  return filteredGigs;
};

export const fetchEvents = async (filters?: any): Promise<Event[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  let filteredEvents = [...mockEvents];
  
  if (filters?.category) {
    filteredEvents = filteredEvents.filter(event =>
      event.category === filters.category
    );
  }
  
  if (filters?.location) {
    filteredEvents = filteredEvents.filter(event =>
      event.location.type === filters.location
    );
  }
  
  return filteredEvents;
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDashboardStats;
};
