
import { User, Case, Hearing, Document, UserRole, CaseStatus, DisputeType } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@orrr.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: '2023-01-01T00:00:00Z',
    isVerified: true,
  },
  {
    id: '2',
    name: 'Neutral Smith',
    email: 'neutral@orrr.com',
    role: 'neutral',
    avatar: 'https://i.pravatar.cc/150?img=2',
    createdAt: '2023-01-02T00:00:00Z',
    isVerified: true,
  },
  {
    id: '3',
    name: 'Client Johnson',
    email: 'client@orrr.com',
    role: 'client',
    avatar: 'https://i.pravatar.cc/150?img=3',
    createdAt: '2023-01-03T00:00:00Z',
    isVerified: true,
  },
  {
    id: '4',
    name: 'Neutral Davis',
    email: 'neutral2@orrr.com',
    role: 'neutral',
    avatar: 'https://i.pravatar.cc/150?img=4',
    createdAt: '2023-02-03T00:00:00Z',
    isVerified: true,
  },
  {
    id: '5',
    name: 'Client Moore',
    email: 'client2@orrr.com',
    role: 'client',
    avatar: 'https://i.pravatar.cc/150?img=5', 
    createdAt: '2023-02-10T00:00:00Z',
    isVerified: false,
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'd1',
    name: 'Contract Agreement.pdf',
    url: '#',
    uploadedAt: '2023-03-15T10:30:00Z',
    size: 0, // Adding size property
    uploadedBy: '3',
  },
  {
    id: 'd2',
    name: 'Evidence Document.pdf',
    url: '#',
    uploadedAt: '2023-03-16T08:20:00Z',
    size: 0, // Adding size property
    uploadedBy: '3',
  },
  {
    id: 'd3',
    name: 'Witness Statement.pdf',
    url: '#',
    uploadedAt: '2023-03-20T14:15:00Z',
    size: 0, // Adding size property
    uploadedBy: '5',
  },
];

export const mockHearings: Hearing[] = [
  {
    id: 'h1',
    title: 'Initial Consultation',
    description: 'First meeting to discuss the dispute details',
    caseId: 'c1', // Adding caseId property
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    duration: 60,
    meetingLink: 'https://meeting.orrr.com/abc123',
  },
  {
    id: 'h2',
    title: 'Evidence Review',
    description: 'Review of submitted evidence and documents',
    caseId: 'c1', // Adding caseId property
    scheduledAt: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    duration: 90,
    meetingLink: 'https://meeting.orrr.com/def456',
  },
  {
    id: 'h3',
    title: 'Final Resolution Meeting',
    description: 'Discussion of proposed resolution',
    caseId: 'c2', // Adding caseId property
    scheduledAt: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
    duration: 120,
    meetingLink: 'https://meeting.orrr.com/ghi789',
  },
];

export const mockCases: Case[] = [
  {
    id: 'c1',
    title: 'Contract Dispute - ABC Corp vs XYZ Ltd',
    description: 'Dispute regarding breach of service contract dated Jan 5, 2023',
    status: 'in_progress',
    disputeType: 'mediation',
    createdAt: '2023-03-10T09:00:00Z',
    updatedAt: '2023-03-20T14:30:00Z',
    clientId: '3',
    neutralId: '2',
    createdBy: '3',
    documents: [mockDocuments[0], mockDocuments[1]],
    hearings: [mockHearings[0], mockHearings[1]],
    parties: [], // Adding empty arrays for required properties
    messages: [],
    events: [],
  },
  {
    id: 'c2',
    title: 'Employment Termination Dispute',
    description: 'Wrongful termination claim by former employee',
    status: 'pending',
    disputeType: 'arbitration',
    createdAt: '2023-04-01T10:15:00Z',
    updatedAt: '2023-04-01T10:15:00Z',
    clientId: '5',
    createdBy: '5',
    documents: [mockDocuments[2]],
    hearings: [],
    parties: [], // Adding empty arrays for required properties
    messages: [],
    events: [],
  },
  {
    id: 'c3',
    title: 'Intellectual Property Dispute',
    description: 'Copyright infringement claim regarding software code',
    status: 'resolved',
    disputeType: 'arbitration',
    createdAt: '2023-02-15T11:30:00Z',
    updatedAt: '2023-03-25T16:45:00Z',
    clientId: '3',
    neutralId: '4',
    createdBy: '3',
    documents: [],
    hearings: [mockHearings[2]],
    parties: [], // Adding empty arrays for required properties
    messages: [],
    events: [],
  },
];

export const generateDashboardStats = (userId: string, role: UserRole) => {
  let filteredCases;
  
  if (role === 'admin') {
    filteredCases = mockCases;
  } else if (role === 'neutral') {
    filteredCases = mockCases.filter(c => c.neutralId === userId);
  } else {
    filteredCases = mockCases.filter(c => c.clientId === userId);
  }
  
  const stats = {
    totalCases: filteredCases.length,
    pendingCases: filteredCases.filter(c => c.status === 'pending').length,
    resolvedCases: filteredCases.filter(c => c.status === 'resolved').length,
    upcomingHearings: filteredCases.reduce((count, c) => {
      const upcomingHearings = c.hearings.filter(h => new Date(h.scheduledAt) > new Date());
      return count + upcomingHearings.length;
    }, 0),
  };
  
  return stats;
};

// This simulates login functionality until we have a backend
export const mockLogin = (email: string, password: string) => {
  const user = mockUsers.find(u => u.email === email);
  
  if (user && password === 'password') { // In real app, we'd properly hash and verify passwords
    return {
      user,
      token: 'mock-jwt-token'
    };
  }
  
  return null;
};
