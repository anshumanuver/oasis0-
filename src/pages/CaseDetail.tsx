
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { fetchCaseDetails } from '@/integrations/supabase/cases';
import { supabase } from '@/integrations/supabase/client';
import { Case } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CaseTimeline from '@/components/case/CaseTimeline';
import CaseDocuments from '@/components/case/CaseDocuments';
import CaseMessages from '@/components/case/CaseMessages';

export default function CaseDetail() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId || !user) return;
    
    const fetchCase = async () => {
      try {
        setLoading(true);
        const data = await fetchCaseDetails(caseId);
        
        if (data) {
          // Convert the data to match our Case type
          const formattedCase: Case = {
            id: data.id,
            title: data.title,
            description: data.description,
            disputeType: data.case_type,
            status: data.status,
            createdAt: data.created_at,
            updatedAt: data.updated_at || data.created_at,
            createdBy: data.created_by,
            parties: [], // Would need a separate fetch to get parties
            documents: [], // Would need a separate fetch to get documents
            messages: [], // Would need a separate fetch to get messages
            events: [], // Would need to construct events from case history
          };
          
          setCaseData(formattedCase);
          
          // Fetch parties for this case
          const { data: parties, error: partiesError } = await supabase
            .from('case_parties')
            .select('*')
            .eq('case_id', caseId);
            
          if (partiesError) {
            console.error('Error fetching parties:', partiesError);
          }
          
          // Fetch documents for this case
          const { data: documents, error: documentsError } = await supabase
            .from('documents')
            .select('*')
            .eq('case_id', caseId);
            
          if (documentsError) {
            console.error('Error fetching documents:', documentsError);
          }
        } else {
          navigate('/cases');
          toast({
            title: "Case not found",
            description: "The requested case could not be found",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('Error fetching case:', err);
        setError('Failed to load case details. Please try again.');
        toast({
          title: "Error",
          description: "Failed to load case details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCase();
  }, [caseId, navigate, user]);
  
  const handleResolveCase = async () => {
    if (!caseId || !user) return;
    
    try {
      const { error } = await supabase
        .from('cases')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('id', caseId);
        
      if (error) throw error;
      
      toast({
        title: "Case resolved",
        description: "The case status has been updated successfully"
      });
      
      // Update local state
      setCaseData(prev => {
        if (!prev) return null;
        return { ...prev, status: 'resolved' };
      });
      
    } catch (err) {
      console.error('Error resolving case:', err);
      toast({
        title: "Error",
        description: "Failed to update case status",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orrr-blue-500"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !caseData) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Case</h2>
            <p className="text-red-700">{error || "Case not found"}</p>
            <Button onClick={() => navigate('/cases')} className="mt-4">
              Back to Cases
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Check if the current user is a party or creator of this case
  const isCreator = caseData.createdBy === user?.id;
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{caseData.title}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 text-xs rounded-full ${
                caseData.status === 'resolved' 
                  ? 'bg-green-100 text-green-800' 
                  : caseData.status === 'in_progress' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                Case #{caseData.id.substring(0, 8)}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            {isCreator && caseData.status !== 'resolved' && (
              <Button onClick={handleResolveCase}>
                Mark as Resolved
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/cases')}>
              Back to Cases
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="details" className="mt-6">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            <div className="bg-white rounded-md shadow p-6">
              <h2 className="font-semibold text-lg mb-2">Case Description</h2>
              <p className="text-gray-700 mb-6">{caseData.description}</p>
              
              <h2 className="font-semibold text-lg mb-2">Case Details</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{caseData.disputeType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Filed On</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(caseData.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{caseData.status.replace('_', ' ')}</dd>
                </div>
                {caseData.status === 'resolved' && caseData.resolvedAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Resolved On</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(caseData.resolvedAt).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            
            <div className="mt-6">
              <h2 className="font-semibold text-lg mb-4">Case Timeline</h2>
              <CaseTimeline events={caseData.events || []} />
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <CaseDocuments documents={caseData.documents || []} />
          </TabsContent>
          
          <TabsContent value="messages" className="mt-6">
            <CaseMessages messages={caseData.messages || []} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
