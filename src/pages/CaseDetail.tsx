
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNotification } from '@/hooks/use-notification';
import { mockCases } from '@/data/mockData'; // This would be replaced with actual API calls
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
  const { toast } = useToast();
  const { sendNotification } = useNotification();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseId) return;
    
    // In a real app, you would fetch the case data from your API/database
    // For now, we'll simulate it with our mock data
    const fetchCaseData = () => {
      setLoading(true);
      
      const foundCase = mockCases.find(c => c.id === caseId);
      
      if (foundCase) {
        setCaseData(foundCase);
      } else {
        toast({
          title: "Case not found",
          description: "The requested case could not be found",
          variant: "destructive"
        });
        navigate('/dashboard');
      }
      
      setLoading(false);
    };
    
    fetchCaseData();
  }, [caseId, navigate, toast]);
  
  if (loading || !caseData) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orrr-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  const handleResolveCase = () => {
    // In a real app, you would make an API call to update the case status
    toast({
      title: "Case marked as resolved",
      description: "The case status has been updated successfully"
    });
    
    // Send notification to all parties
    if (user?.id && caseData) {
      caseData.parties.forEach(party => {
        if (party.id !== user.id) {
          sendNotification({
            recipientId: party.id,
            title: "Case Status Updated",
            content: `Case "${caseData.title}" has been marked as resolved`,
            relatedToCaseId: caseData.id
          });
        }
      });
    }
  };
  
  const isParty = caseData.parties.some(party => party.id === user?.id);
  const isNeutral = caseData.neutralId === user?.id;

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
            {(isParty || isNeutral) && caseData.status !== 'resolved' && (
              <Button onClick={handleResolveCase}>
                Mark as Resolved
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="timeline" className="mt-6">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-6">
            <CaseTimeline caseData={caseData} />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <CaseDocuments caseId={caseData.id} />
          </TabsContent>
          
          <TabsContent value="messages" className="mt-6">
            <CaseMessages messages={caseData.messages} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
