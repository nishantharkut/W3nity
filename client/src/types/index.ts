
export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  walletAddress?: string;
  isVerified: boolean;
  joinedAt: Date;
  location?: string;
  role: 'freelancer' | 'client' | 'organizer';
  fullName?: string;
  socialLinks?: string[];
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  hourlyRate?: number;
  companyName?: string;
  clientSince?: Date;
}

export interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
    currency: string;
    type?: 'fixed' | 'hourly';
  };
  skills: string[];
  minBudget: number;
maxBudget: number;

  budgetType: String,
  client: {
    id: string;
    username: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    avatar?: string;
  };
  category: string;
  duration: string;
  experienceLevel: 'entry' | 'intermediate' | 'expert';
    createdBy:{
    id: string;
    username: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    avatar?: string;
  }
  postedAt: Date;
  createdAt: Date;
  deadline: Date;
  proposalCount: number;
  proposals: Proposal[];
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  tags?: string[];
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: {
    type: 'online' | 'physical' | 'hybrid';
    address?: string;
    coordinates?: { lat: number; lng: number };
    meetingLink?: string;
  };
  category: string;
  organizer: {
    id: string;
    username: string;
    avatar?: string;
  };
  currentAttendees: number;
  maxAttendees?: number;
  price: number;
  currency?: string;
  tags: string[];
  image?: string;
  registrationDeadline?: Date;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  registrations?: string[];
}

export interface ChatMessage {
  _id: string;
  userId: string;
  username: string;
  avatar?: string;
  message: string;
  timestamp: Date;
  isSystem?: boolean;
}

export interface ChatRoom {
  _id: string;
  name: string;
  description?: string;
  type: 'public' | 'private';
  members: User[];
  memberCount: number;
  category: string;
  createdAt: Date;
  lastActivity: Date;
}

export interface Proposal {
  _id: string;
  gigId: string;
  freelancerId: string;
  coverLetter: string;
  proposedBudget: number;
  deliveryTime: number;
  attachments?: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: Date;
}

export interface Review {
  id: string;
  fromUserId: string;
  toUserId: string;
  projectId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'proposal' | 'payment' | 'system';
  title: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Missing types for useChat hook
export interface Message {
  id: string;
  groupId: string;
  sender: User;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: Date;
  reactions: Array<{
    emoji: string;
    users: string[];
    count: number;
  }>;
}

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  members: User[];
  admins: string[];
  createdAt: Date;
  lastActivity: Date;
  isArchived: boolean;
}

// Missing type for useWeb3 hook
export interface Web3State {
  account: string | null;
  isConnected: boolean;
  chainId: number | null;
  // chainName: string | null;
  balance: string | null; // Typically in ETH, formatted (e.g., "1.234")
  isLoading: boolean;
  error: string | null;
}


// Missing type for dashboard stats
export interface DashboardStats {
  freelance: {
    activeGigs: number;
    totalProposals: number;
    acceptanceRate: number;
    earnings: number;
  };
  events: {
    registeredEvents: number;
    hostedEvents: number;
    upcomingEvents: number;
  };
  community: {
    totalMessages: number;
    activeGroups: number;
    connections: number;
  };
}