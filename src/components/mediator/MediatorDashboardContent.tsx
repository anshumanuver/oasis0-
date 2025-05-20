
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import CaseAssignmentCard from '@/components/mediator/CaseAssignmentCard';
import CasePriorityList from '@/components/mediator/CasePriorityList';
import MediatorPerformance from '@/components/mediator/MediatorPerformance';
import { MediatorStats, Case } from '@/types';
import { fetchUserCases } from '@/integrations/supabase/cases';

export default function MediatorDashboardContent() {
  const [cases, setCases] = useState<Case[]>([]);
  const [stats, setStats] = useState<MediatorStats>({
    activeCases: 0,
    resolvedCases: 0,
    pendingHearings: 0,
    casesThisMonth: 0,
    resolutionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        setLoading(true);
        const mediatorCases = await fetchUserCases(user.id);
        setCases(mediatorCases);
        
        // Calculate stats
        const active = mediatorCases.filter(c => c.status === 'in_progress').length;
        const resolved = mediatorCases.filter(c => c.status === 'resolved').length;
        const total = active + resolved;
        const resolutionRate = total > 0 ? (resolved / total) * 100 : 0;
        
        // Count cases created this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const casesThisMonth = mediatorCases.filter(
          c => new Date(c.createdAt) >= startOfMonth
        ).length;
        
        // Count upcoming hearings
        const pendingHearings = mediatorCases.filter(c => c.nextHearingDate).length;
        
        setStats({
          activeCases: active,
          resolvedCases: resolved,
          pendingHearings,
          casesThisMonth,
          resolutionRate
        });
      } catch (error) {
        console.error('Error loading mediator data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orrr-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <MediatorPerformance stats={stats} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Case Assignments</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/cases">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {cases.filter(c => c.status !== 'resolved')
              .slice(0, 3)
              .map(caseItem => (
                <CaseAssignmentCard 
                  key={caseItem.id}
                  caseId={caseItem.id}
                  title={caseItem.title}
                  type={caseItem.disputeType}
                  date={caseItem.createdAt}
                  status={caseItem.status}
                />
              ))}
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Priority Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <CasePriorityList cases={cases.filter(c => c.status !== 'resolved')} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Hearings</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            {cases.some(c => c.nextHearingDate) ? (
              cases
                .filter(c => c.nextHearingDate)
                .sort((a, b) => 
                  new Date(a.nextHearingDate!).getTime() - new Date(b.nextHearingDate!).getTime()
                )
                .slice(0, 3)
                .map(caseItem => (
                  <div key={caseItem.id} className="mb-4 last:mb-2">
                    <p className="font-medium">{caseItem.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(caseItem.nextHearingDate!).toLocaleDateString()}
                    </p>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center py-2">No upcoming hearings</p>
            )}
            
            <div className="text-center pt-4 border-t">
              <Button asChild variant="link" size="sm">
                <Link to="/hearings">View All Hearings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
