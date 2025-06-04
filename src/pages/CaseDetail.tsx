
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { fetchCaseDetails, getUserRoleInCase } from '@/integrations/supabase/cases';
import MainLayout from '@/components/layout/MainLayout';
import CaseWorkspace from '@/components/case/CaseWorkspace';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Case } from '@/types';

export default function CaseDetail() {
  const { caseId } = useParams<{ caseId: string }>();
  const { user, profile } = useAuth();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [userRole, setUserRole] = useState<'claimant' | 'respondent' | 'neutral' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCaseData() {
      if (!caseId || !user) return;

      try {
        setLoading(true);
        
        // Fetch case details
        const case_data = await fetchCaseDetails(caseId);
        setCaseData(case_data);

        // Determine user's role in the case
        if (profile?.role === 'admin') {
          setUserRole('admin');
        } else {
          const role = await getUserRoleInCase(caseId, user.id);
          setUserRole(role);
        }
      } catch (err) {
        console.error('Error loading case data:', err);
        setError('Failed to load case details. Please check if you have access to this case.');
      } finally {
        setLoading(false);
      }
    }

    loadCaseData();
  }, [caseId, user, profile]);

  if (loading) {
    return (
      <MainLayout requireAuth>
        <div className="container py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !caseData || !userRole) {
    return (
      <MainLayout requireAuth>
        <div className="container py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'You do not have access to this case.'}
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth>
      <div className="container py-8">
        <CaseWorkspace caseData={caseData} userRole={userRole} />
      </div>
    </MainLayout>
  );
}
