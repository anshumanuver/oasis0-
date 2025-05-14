
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { mockCases, generateDashboardStats } from '@/data/mockData';
import { FileText, Calendar, MessageSquare, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import CasesTable from '@/components/dashboard/CasesTable';
import UpcomingHearings from '@/components/dashboard/UpcomingHearings';
import { DashboardStats } from '@/types';
import PartyActions from '@/components/party/PartyActions';
import PartyMessages from '@/components/party/PartyMessages';
import CaseProgress from '@/components/party/CaseProgress';
import PartyDocuments from '@/components/party/PartyDocuments';
import Chatbot from '@/components/chatbot/Chatbot';

export default function PartyDashboard() {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (!user) return null; // Don't render anything while checking authentication

  // Filter cases for this party
  const partyCases = mockCases.filter(caseItem => 
    caseItem.parties.some(party => 
      party.id === user.id || party.email === user.email
    )
  );
  
  // Get dashboard stats
  const stats: DashboardStats = generateDashboardStats(user.id, 'client');

  return (
    <MainLayout withFooter={false}>
      <div className="container py-8">
        <DashboardHeader 
          title="Party Dashboard" 
          description="Monitor and manage your dispute resolution cases"
        />
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Active Cases" 
            value={stats.pendingCases}
            icon={<FileText className="h-6 w-6 text-orrr-blue-500" />}
          />
          <StatsCard 
            title="Upcoming Hearings" 
            value={stats.upcomingHearings}
            icon={<Calendar className="h-6 w-6 text-orrr-teal-500" />}
          />
          <StatsCard 
            title="Unread Messages" 
            value={Math.floor(Math.random() * 5)} // Mock value
            icon={<MessageSquare className="h-6 w-6 text-purple-500" />}
          />
          <StatsCard 
            title="Documents Pending" 
            value={Math.floor(Math.random() * 3)} // Mock value
            icon={<AlertTriangle className="h-6 w-6 text-yellow-500" />}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case details section */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">My Cases</h2>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/cases">View all</a>
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <CasesTable cases={partyCases.slice(0, 5)} />
              </div>
            </Card>
            
            {/* Case Progress */}
            {partyCases.length > 0 && (
              <Card className="mb-6">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-medium">Case Progress</h2>
                </div>
                <div className="p-6">
                  <CaseProgress caseData={partyCases[0]} />
                </div>
              </Card>
            )}
            
            {/* Documents */}
            <Card className="mb-6">
              <div className="p-6">
                <PartyDocuments caseId={partyCases.length > 0 ? partyCases[0].id : undefined} />
              </div>
            </Card>
            
            {/* Start New Case button */}
            <div className="mt-6">
              <Button className="w-full" size="lg" asChild>
                <a href="/cases/new">File a New Case</a>
              </Button>
            </div>
          </div>
          
          {/* Right sidebar */}
          <div>
            {/* Upcoming Hearings */}
            <UpcomingHearings cases={partyCases} />
            
            {/* Recent Messages */}
            <Card className="mt-6 mb-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium">Recent Messages</h2>
              </div>
              <div className="p-6">
                <PartyMessages partyCases={partyCases} />
              </div>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium">Quick Actions</h2>
              </div>
              <div className="p-6">
                <PartyActions />
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Chatbot Component */}
      <Chatbot />
    </MainLayout>
  );
}
