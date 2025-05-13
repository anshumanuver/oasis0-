// User related types
export type UserRole = 'admin' | 'neutral' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  isVerified: boolean;
}

// Case related types
export type CaseStatus = 'pending' | 'in_progress' | 'resolved';
export type DisputeType = 'negotiation' | 'mediation' | 'arbitration' | 'conciliation';

export interface Party {
  id: string;
  name: string;
  email: string;
  role: 'claimant' | 'respondent' | 'neutral' | 'witness';
}

export interface Document {
  id: string;
  name: string;
  uploadedAt: string;
  size: number;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  sentAt: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  disputeType: DisputeType;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  parties?: Party[];
  documents?: Document[];
  messages?: Message[];
  events?: TimelineEvent[];
  nextHearingDate?: string;
}

// Dashboard data types
export interface DashboardStats {
  totalCases: number;
  pendingCases: number;
  resolvedCases: number;
  upcomingHearings: number;
}
