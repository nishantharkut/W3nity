
export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  password?: string; // optional, usually not exposed to frontend
  role: 'freelancer' | 'client' | 'organizer';
  bio?: string;
  location?: string;
  skills: string[];
  socialLinks: string[]; // array of URLs
  companyName?: string;  // for clients
  clientSince: Date;    // for clients
  createdAt: Date;
  updatedAt: Date;
  joinedAt: Date;
}


export interface Gig {
  id: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
    currency: string;
    type?: 'fixed' | 'hourly';
  };
  skills: string[];
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
  postedAt: Date;
  createdAt: Date;
  deadline: Date;
  proposalCount: number;
  proposals: Proposal[];
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: {
    type: 'online' | 'physical' | 'hybrid';
    address?: string;
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
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  message: string;
  timestamp: Date;
  isSystem?: boolean;
}

export interface ChatRoom {
  id: string;
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
  id: string;
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
