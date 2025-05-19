
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
  resolvedAt?: string;
  parties: Party[];
  documents: Document[];
  messages: Message[];
  events: Event[];
  nextHearingDate?: string;
  clientId?: string;
  neutralId?: string;
  hearings?: Hearing[];
}

export interface Party {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'claimant' | 'respondent' | 'neutral' | 'witness';
  isClient?: boolean;
}

export interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  sentAt: string;
  timestamp: string;
}

export interface Event {
  id: string;
  caseId: string;
  title: string;
  description: string;
  date: string;
  type: string;
  timestamp: string;
}

export interface Document {
  id: string;
  name: string;
  uploadedAt: string;
  size: number;
  url?: string;
  type?: string;
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
  scheduledAt?: string;
  duration?: number;
  meetingLink?: string;
}

export interface Trend {
  value: number;
  isPositive: boolean;
}

export interface MediatorStats {
  activeCases: number;
  resolvedCases: number;
  pendingHearings: number;
  casesThisMonth: number;
  resolutionRate: number;
}

export interface CaseAssignment {
  id: string;
  caseId: string;
  assignedDate: string;
  status: 'pending' | 'accepted' | 'declined';
}
