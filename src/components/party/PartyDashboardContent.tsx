
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchUserCases } from '@/integrations/supabase/cases';
import { Case } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PartyStats from '@/components/party/PartyStats';
import CaseProgress from '@/components/party/CaseProgress';
import PartyMessages from '@/components/party/PartyMessages';
import PartyActions from '@/components/party/PartyActions';
import PartyDocuments from '@/components/party/PartyDocuments';

export default function PartyDashboardContent() {
  const [partyCases, setPartyCases] = useState<Case[]>([]);
  const [activeCases, setActiveCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadCases() {
      if (!user) return;
      try {
        setLoading(true);
        const cases = await fetchUserCases(user.id);
        setPartyCases(cases);
        setActiveCases(cases.filter(c => c.status !== 'resolved'));
      } catch (error) {
        console.error('Error loading cases:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orrr-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <PartyStats cases={partyCases} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active case progress */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            {activeCases.length > 0 ? (
              <div className="space-y-6">
                {activeCases.slice(0, 3).map(caseData => (
                  <div key={caseData.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <CaseProgress caseData={caseData} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                You don't have any active cases
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <PartyActions />
          </CardContent>
        </Card>

        {/* Recent messages */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <PartyMessages partyCases={partyCases} />
          </CardContent>
        </Card>

        {/* Recent documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <PartyDocuments documents={partyCases.flatMap(c => c.documents).slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
