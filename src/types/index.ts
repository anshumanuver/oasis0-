
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

// Add the User type needed by mockData.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  isVerified: boolean;
}

export type UserRole = 'client' | 'neutral' | 'admin';

// Add CaseStatus and DisputeType types
export type CaseStatus = 'pending' | 'in_progress' | 'resolved';
export type DisputeType = 'negotiation' | 'mediation' | 'arbitration' | 'conciliation';

export interface Case {
  id: string;
  title: string;
  description: string;
  disputeType: DisputeType;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  parties: Party[];
  documents: Document[];
  messages: Message[];
  events: Event[];
  nextHearingDate?: string;
  clientId?: string;
  neutralId?: string;
  hearings?: Hearing[]; // Add hearings property for UpcomingHearings component
}

export interface Party {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isClient: boolean;
  role?: 'claimant' | 'respondent' | 'neutral' | 'witness'; // Add role for CaseDetail.tsx
}

export interface Document {
  id: string;
  name: string;
  uploadedAt: string;
  size: number;
  url?: string;
  uploadedBy?: string; // Add for mockData.ts
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  sender?: string;  // Add for CaseDetail.tsx
  sentAt?: string;  // Add for CaseDetail.tsx
}

export interface Event {
  id: string;
  caseId: string;
  type: string;
  description: string;
  timestamp: string;
  title?: string;  // Add for CaseDetail.tsx
  date?: string;   // Add for CaseDetail.tsx
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
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
  date?: string;
  title: string;
  description?: string;
  scheduledAt?: string; // Add for mockData.ts
  duration?: number;    // Add for mockData.ts
  meetingLink?: string; // Add for mockData.ts
}

export interface Trend {
  value: number;
  isPositive: boolean;
}
