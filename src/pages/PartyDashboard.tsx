
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CasesTable from '@/components/dashboard/CasesTable';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import PartyActions from '@/components/party/PartyActions';
import PartyMessagingWidget from '@/components/party/PartyMessagingWidget';
import UpcomingHearings from '@/components/dashboard/UpcomingHearings';
import HearingManagement from '@/components/hearings/HearingManagement';
import { useAuth } from '@/context/AuthContext';
import { mockCases } from '@/data/mockData';
import { Case } from '@/types';

export default function PartyDashboard() {
  const [cases, setCases] = useState<Case[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // In production, fetch actual cases from API
    // For now, we use mock data
    const filteredCases = mockCases.filter(
      c => c.parties.some(p => p.id === user?.id)
    );
    setCases(filteredCases);
  }, [user]);

  return (
    <MainLayout requireAuth>
      <div className="container py-8">
        <DashboardHeader
          title="Party Dashboard"
          description="Manage your cases and dispute resolution process"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Active Cases"
            value={cases.filter(c => c.status !== 'resolved').length}
            description="Currently open cases"
            trend="up"
          />
          <StatsCard
            title="Resolved Cases"
            value={cases.filter(c => c.status === 'resolved').length}
            description="Successfully completed"
            trend="none"
          />
          <StatsCard
            title="Documents"
            value={cases.reduce((sum, c) => sum + (c.documents?.length || 0), 0)}
            description="Across all cases"
            trend="none"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <HearingManagement />
          </div>
          <div>
            <PartyActions />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <CasesTable cases={cases} />
          </div>
          <div>
            <PartyMessagingWidget />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
