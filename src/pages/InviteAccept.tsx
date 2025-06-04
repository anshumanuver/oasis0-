
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getInvitationByToken, acceptInvitation } from '@/integrations/supabase/invitations';
import { fetchCaseDetails } from '@/integrations/supabase/cases';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function InviteAccept() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [invitation, setInvitation] = useState<any>(null);
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInvitation() {
      if (!token) {
        setError('Invalid invitation link');
        setLoading(false);
        return;
      }

      try {
        const invitationData = await getInvitationByToken(token);
        setInvitation(invitationData);

        const caseData = await fetchCaseDetails(invitationData.case_id);
        setCaseDetails(caseData);
      } catch (err) {
        console.error('Error loading invitation:', err);
        setError('Invalid or expired invitation link');
      } finally {
        setLoading(false);
      }
    }

    loadInvitation();
  }, [token]);

  const handleAcceptInvitation = async () => {
    if (!user || !token) {
      toast({
        title: "Authentication required",
        description: "Please sign in to accept this invitation",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    setAccepting(true);
    try {
      await acceptInvitation(token, user.id);
      
      toast({
        title: "Invitation accepted",
        description: "You have been added to the case as a respondent"
      });
      
      navigate(`/cases/${invitation.case_id}`);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast({
        title: "Error",
        description: "Failed to accept invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8 max-w-2xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container py-8 max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Case Invitation</CardTitle>
            <p className="text-gray-600">You've been invited to participate in a dispute resolution case</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {caseDetails && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Case Details</h3>
                <p className="text-sm text-gray-600 mb-1"><strong>Title:</strong> {caseDetails.title}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Type:</strong> {caseDetails.disputeType}</p>
                <p className="text-sm text-gray-600"><strong>Description:</strong> {caseDetails.description}</p>
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">What happens next?</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• You'll be added as a respondent to this case</li>
                <li>• You'll gain access to the case workspace</li>
                <li>• You can communicate with other parties through secure messaging</li>
                <li>• You'll be notified of any case updates and hearings</li>
              </ul>
            </div>

            {user ? (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Decline
                </Button>
                <Button 
                  onClick={handleAcceptInvitation}
                  disabled={accepting}
                  className="flex-1"
                >
                  {accepting ? "Accepting..." : "Accept Invitation"}
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Please sign in to accept this invitation</p>
                <Button onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
