
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

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  disputeType: DisputeType;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  neutralId?: string;
  documents: Document[];
  hearings: Hearing[];
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Hearing {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number; // in minutes
  meetingLink?: string;
}

// Dashboard data types
export interface DashboardStats {
  totalCases: number;
  pendingCases: number;
  resolvedCases: number;
  upcomingHearings: number;
}
