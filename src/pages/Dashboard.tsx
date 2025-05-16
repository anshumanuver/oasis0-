
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import CasesTable from '@/components/dashboard/CasesTable';
import UpcomingHearings from '@/components/dashboard/UpcomingHearings';
import HearingManagement from '@/components/hearings/HearingManagement';
import { useEffect, useState } from 'react';
import { mockCases } from '@/data/mockData';
import { Case } from '@/types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    // In a real implementation, fetch cases from API
    setCases(mockCases);
  }, []);

  return (
    <MainLayout requireAuth>
      <div className="container py-8">
        <DashboardHeader 
          title="Dashboard" 
          description="Manage your cases and dispute resolution processes"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total Cases" 
            value={cases.length} 
            description="All cases"
            trend="up"
          />
          <StatsCard 
            title="Active Cases" 
            value={cases.filter(c => c.status !== 'resolved').length} 
            description="Currently active"
            trend="up"
          />
          <StatsCard 
            title="Resolved Cases" 
            value={cases.filter(c => c.status === 'resolved').length} 
            description="Successfully completed"
            trend="up"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <HearingManagement />
          </div>
          <div>
            <UpcomingHearings cases={cases} />
          </div>
        </div>
        
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Cases</h2>
          <Button asChild>
            <Link to="/cases/new">New Case</Link>
          </Button>
        </div>
        
        <CasesTable cases={cases.slice(0, 5)} />
        
        {cases.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link to="/cases">View All Cases</Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
