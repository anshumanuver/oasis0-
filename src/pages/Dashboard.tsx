
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { mockCases, generateDashboardStats } from '@/data/mockData';
import { FileText, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import CasesTable from '@/components/dashboard/CasesTable';
import UpcomingHearings from '@/components/dashboard/UpcomingHearings';
import { DashboardStats, UserRole } from '@/types';

export default function Dashboard() {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (!user) return null; // Don't render anything while checking authentication

  // Get user role from profile or default to 'client'
  const userRole = profile?.role as UserRole || 'client';

  // Filter cases according to user role
  const userCases = userRole === 'admin' 
    ? mockCases 
    : userRole === 'neutral'
      ? mockCases.filter(caseItem => caseItem.neutralId === user.id)
      : mockCases.filter(caseItem => caseItem.clientId === user.id);
  
  // Get dashboard stats
  const stats: DashboardStats = generateDashboardStats(user.id, userRole);

  return (
    <MainLayout withFooter={false}>
      <div className="container py-8">
        <DashboardHeader 
          title="Dashboard" 
          description="Welcome to your orrr ODR platform dashboard"
        />
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Cases" 
            value={stats.totalCases}
            icon={<FileText className="h-6 w-6 text-orrr-blue-500" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard 
            title="Pending Cases" 
            value={stats.pendingCases}
            icon={<AlertTriangle className="h-6 w-6 text-yellow-500" />}
          />
          <StatsCard 
            title="Resolved Cases" 
            value={stats.resolvedCases}
            icon={<CheckCircle className="h-6 w-6 text-green-500" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard 
            title="Upcoming Hearings" 
            value={stats.upcomingHearings}
            icon={<Calendar className="h-6 w-6 text-orrr-teal-500" />}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Cases */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Recent Cases</h2>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/cases">View all</a>
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <CasesTable cases={userCases.slice(0, 5)} />
              </div>
            </Card>
            
            {userRole === 'client' && (
              <div className="mt-6">
                <Button className="w-full" size="lg" asChild>
                  <a href="/cases/new">File a New Case</a>
                </Button>
              </div>
            )}
          </div>
          
          {/* Upcoming Hearings */}
          <div>
            <UpcomingHearings cases={userCases} />
            
            {/* Additional cards can go here */}
            <Card className="mt-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                {userRole === 'client' && (
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Upload New Document
                  </Button>
                )}
                {userRole === 'neutral' && (
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule a Hearing
                  </Button>
                )}
                <Button variant="outline" className="w-full justify-start">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Start Video Conference
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
