
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, FileText, MessageSquare, Pencil } from 'lucide-react';

import { Case } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import CaseTimeline from '@/components/case/CaseTimeline';
import CaseDocuments from '@/components/case/CaseDocuments';
import CaseMessages from '@/components/case/CaseMessages';

// Mock function to fetch case data - replace with actual API call in production
const fetchCaseById = async (caseId: string): Promise<Case> => {
  // This is a mock implementation - in production, fetch from your API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: caseId,
        title: 'Contract Dispute with XYZ Corp',
        description: 'Dispute regarding breach of service agreement dated January 15, 2025.',
        disputeType: 'mediation',
        status: 'in_progress',
        createdAt: '2025-04-10T10:30:00Z',
        updatedAt: '2025-05-05T14:45:00Z',
        createdBy: 'user-123',
        parties: [
          { id: 'party-1', name: 'Your Company', email: 'your@company.com', role: 'claimant' },
          { id: 'party-2', name: 'XYZ Corporation', email: 'legal@xyz.com', role: 'respondent' }
        ],
        documents: [
          { id: 'doc-1', name: 'Original Contract.pdf', uploadedAt: '2025-04-10T11:00:00Z', size: 2540000 },
          { id: 'doc-2', name: 'Communication Records.zip', uploadedAt: '2025-04-15T09:30:00Z', size: 5640000 }
        ],
        messages: [
          { id: 'msg-1', sender: 'Mediator Johnson', content: "I have reviewed the case and would like to schedule an initial hearing.", sentAt: '2025-04-20T13:15:00Z' },
          { id: 'msg-2', sender: 'XYZ Corp Representative', content: "We are available next Tuesday afternoon.", sentAt: '2025-04-21T10:45:00Z' }
        ],
        events: [
          { id: 'event-1', title: 'Case Filed', description: 'Initial case documentation submitted', date: '2025-04-10T10:30:00Z' },
          { id: 'event-2', title: 'Mediator Assigned', description: 'Jeffrey Johnson assigned as mediator', date: '2025-04-18T14:00:00Z' },
          { id: 'event-3', title: 'First Hearing Scheduled', description: 'Virtual hearing scheduled for May 15', date: '2025-04-22T09:15:00Z' }
        ],
        nextHearingDate: '2025-05-15T14:00:00Z'
      });
    }, 500);
  });
};

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch case data
  const { data: caseData, isLoading, error } = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => fetchCaseById(caseId || ''),
    enabled: !!caseId,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !caseData) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-2xl font-bold mb-4">Error Loading Case</h2>
            <p className="text-gray-600 mb-6">We couldn't load the case details. The case may have been removed or you may not have permission to view it.</p>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <DashboardHeader 
            title={caseData.title}
            description={`Case ID: ${caseData.id} • Filed on ${format(new Date(caseData.createdAt), 'MMM d, yyyy')}`}
          />
          <div className="ml-auto">
            {getStatusBadge(caseData.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case details sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Case Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Type</h4>
                  <p className="capitalize">{caseData.disputeType.replace('_', ' ')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className="capitalize">{caseData.status.replace('_', ' ')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Filed On</h4>
                  <p>{format(new Date(caseData.createdAt), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                  <p>{format(new Date(caseData.updatedAt), 'MMMM d, yyyy')}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Parties Involved</h4>
                  {caseData.parties.map(party => (
                    <div key={party.id} className="mb-2">
                      <p className="font-medium">{party.name}</p>
                      <p className="text-sm text-gray-500">{party.email}</p>
                      <p className="text-xs text-gray-400 capitalize">{party.role}</p>
                    </div>
                  ))}
                </div>
                
                {caseData.nextHearingDate && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Next Hearing</h4>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <p>{format(new Date(caseData.nextHearingDate), 'MMMM d, yyyy h:mm a')}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-2">
                  <Button className="w-full flex items-center justify-center" variant="outline">
                    <Pencil className="mr-2 h-4 w-4" /> Edit Case Details
                  </Button>
                  {caseData.status !== 'resolved' && (
                    <Button className="w-full" variant="default">Schedule Hearing</Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main content area with tabs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="documents">
                      Documents <Badge className="ml-1 bg-primary">{caseData.documents.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="messages">
                      Messages <Badge className="ml-1 bg-primary">{caseData.messages.length}</Badge>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-0">
                    <CardTitle>Case Description</CardTitle>
                    <CardDescription className="mt-2">
                      {caseData.description}
                    </CardDescription>
                    
                    <Separator className="my-6" />
                    
                    <CardTitle className="mb-4">Timeline</CardTitle>
                    <CaseTimeline events={caseData.events} />
                  </TabsContent>
                  
                  <TabsContent value="documents" className="mt-0">
                    <CardTitle className="mb-4">Case Documents</CardTitle>
                    <CaseDocuments documents={caseData.documents} />
                  </TabsContent>
                  
                  <TabsContent value="messages" className="mt-0">
                    <CardTitle className="mb-4">Case Communications</CardTitle>
                    <CaseMessages messages={caseData.messages} />
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
