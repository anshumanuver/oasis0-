export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  city?: string;
  country?: string;
  zip_code?: string;
  bio?: string;
  avatar_url?: string;
  role?: UserRole;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'client' | 'neutral' | 'admin';

export interface Case {
  id: string;
  title: string;
  description: string;
  disputeType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  parties: Party[];
  documents: Document[];
  messages: Message[];
  events: Event[];
  nextHearingDate?: string;
  clientId?: string;  // Added missing property
  neutralId?: string; // Added missing property
}

export interface Party {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isClient: boolean;
}

export interface Document {
  id: string;
  name: string;
  uploadedAt: string;
  size: number;
  url?: string;  // Added missing property
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Event {
  id: string;
  caseId: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface DashboardStats {
  totalCases: number;
  pendingCases: number;
  resolvedCases: number;
  upcomingHearings: number;
}

export interface Hearing {
  id: string;
  caseId: string;
  date: string;
  title: string;
  description?: string;
}

export interface Trend {
  value: number;
  isPositive: boolean;
}
