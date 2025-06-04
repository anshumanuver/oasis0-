
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCaseDocuments } from '@/services/documentService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CaseMessages from './CaseMessages';
import CaseDocuments from './CaseDocuments';
import { Case } from '@/types';

interface CaseWorkspaceProps {
  caseData: Case;
  userRole: 'claimant' | 'respondent' | 'neutral' | 'admin';
}

export default function CaseWorkspace({ caseData, userRole }: CaseWorkspaceProps) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [visibleDocuments, setVisibleDocuments] = useState([]);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const docs = await getCaseDocuments(caseData.id);
        setDocuments(docs || []);
        
        // Filter documents based on user role
        const filtered = (docs || []).filter(doc => {
          // Neutrals and admins can see all documents
          if (userRole === 'neutral' || userRole === 'admin') {
            return true;
          }
          // Parties can only see documents marked as visible to parties
          return doc.visible_to_parties;
        });
        
        setVisibleDocuments(filtered);
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    }

    loadDocuments();
  }, [caseData.id, userRole]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisputeTypeDisplay = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Case Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{caseData.title}</CardTitle>
              <p className="text-gray-600 mt-1">{caseData.description}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(caseData.status)}>
                {caseData.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {getDisputeTypeDisplay(caseData.disputeType)}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Role indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-900">Your Role in this Case</h3>
            <p className="text-sm text-blue-700 capitalize">{userRole}</p>
          </div>
          {userRole === 'neutral' && (
            <Badge className="bg-purple-100 text-purple-800">
              Case Neutral
            </Badge>
          )}
        </div>
      </div>

      {/* Case Workspace Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Case Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Created:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(caseData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(caseData.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {caseData.nextHearingDate && (
                  <div>
                    <span className="font-medium">Next Hearing:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(caseData.nextHearingDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {caseData.parties.map((party) => (
                    <div key={party.id} className="flex justify-between items-center">
                      <span>{party.name}</span>
                      <Badge variant="outline" className="capitalize">
                        {party.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Case Messages</CardTitle>
              <p className="text-sm text-gray-600">
                Secure communication between all parties
              </p>
            </CardHeader>
            <CardContent>
              <CaseMessages messages={caseData.messages} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Documents
                {userRole !== 'neutral' && userRole !== 'admin' && (
                  <Badge variant="outline" className="text-xs">
                    Limited Access
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {userRole === 'neutral' || userRole === 'admin' 
                  ? "All case documents are visible to neutrals"
                  : "Only documents marked for party viewing are shown"
                }
              </p>
            </CardHeader>
            <CardContent>
              <CaseDocuments documents={visibleDocuments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Case Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseData.events.map((event) => (
                  <div key={event.id} className="border-l-2 border-blue-200 pl-4 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {caseData.events.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No timeline events yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
