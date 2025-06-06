
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { mockCases } from '@/data/mockData';
import { Case, Hearing, MediatorStats } from '@/types';
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  BarChart4, 
  UserCheck 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import CasesTable from '@/components/dashboard/CasesTable';
import UpcomingHearings from '@/components/dashboard/UpcomingHearings';
import CasePriorityList from '@/components/mediator/CasePriorityList';
import MediatorPerformance from '@/components/mediator/MediatorPerformance';
import CaseAssignmentCard from '@/components/mediator/CaseAssignmentCard';

export default function MediatorDashboard() {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<MediatorStats>({
    activeCases: 0,
    resolvedCases: 0,
    pendingHearings: 0,
    casesThisMonth: 0,
    resolutionRate: 0
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      navigate('/login');
      return;
    }

    // Check if user is a mediator or arbitrator
    if (!isLoading && user && userRole) {
      if (userRole !== 'neutral' && userRole !== 'admin') {
        navigate('/dashboard');
      }
    }
  }, [user, isLoading, navigate, userRole]);

  useEffect(() => {
    // Calculate mediator stats based on mock data
    if (user) {
      const mediatorCases = mockCases.filter(c => c.neutralId === user.id);
      const active = mediatorCases.filter(c => c.status !== 'resolved').length;
      const resolved = mediatorCases.filter(c => c.status === 'resolved').length;
      
      // Get all hearings for mediator cases
      const allHearings: Hearing[] = [];
      mediatorCases.forEach(c => {
        if (c.hearings) {
          allHearings.push(...c.hearings);
        }
      });
      
      const now = new Date();
      const pending = allHearings.filter(h => new Date(h.scheduledAt) > now).length;
      
      // Cases assigned this month
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const casesThisMonth = mediatorCases.filter(c => {
        const caseDate = new Date(c.createdAt);
        return caseDate.getMonth() === thisMonth && caseDate.getFullYear() === thisYear;
      }).length;
      
      // Calculate resolution rate
      const resolutionRate = mediatorCases.length > 0 
        ? Math.round((resolved / mediatorCases.length) * 100) 
        : 0;
      
      setStats({
        activeCases: active,
        resolvedCases: resolved,
        pendingHearings: pending,
        casesThisMonth: casesThisMonth,
        resolutionRate: resolutionRate
      });
    }
  }, [user]);

  if (!user || isLoading) return null;

  // Filter cases for this mediator
  const mediatorCases = mockCases.filter(caseItem => 
    caseItem.neutralId === user.id || userRole === 'admin'
  );
  
  // Get pending case assignments (mock data for now)
  const pendingAssignments = mockCases
    .filter(c => c.status === 'pending' && !c.neutralId)
    .slice(0, 3);

  return (
    <MainLayout withFooter={false}>
      <div className="container py-8">
        <DashboardHeader 
          title="Mediator Dashboard" 
          description="Manage your mediation and arbitration cases"
        />
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard 
            title="Active Cases" 
            value={stats.activeCases}
            icon={<FileText className="h-6 w-6 text-orrr-blue-500" />}
          />
          <StatsCard 
            title="Resolved Cases" 
            value={stats.resolvedCases}
            icon={<CheckCircle className="h-6 w-6 text-green-500" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard 
            title="Pending Hearings" 
            value={stats.pendingHearings}
            icon={<Calendar className="h-6 w-6 text-orrr-blue-500" />}
          />
          <StatsCard 
            title="Cases This Month" 
            value={stats.casesThisMonth}
            icon={<Clock className="h-6 w-6 text-orrr-teal-500" />}
          />
          <StatsCard 
            title="Resolution Rate" 
            value={`${stats.resolutionRate}%`}
            icon={<BarChart4 className="h-6 w-6 text-purple-500" />}
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Main content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:w-[400px] mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cases">My Cases</TabsTrigger>
            <TabsTrigger value="hearings">Hearings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Priority Cases */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                      Priority Cases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CasePriorityList cases={mediatorCases} />
                  </CardContent>
                </Card>
              </div>
              
              {/* New Case Assignments */}
              <div>
                <CaseAssignmentCard assignments={pendingAssignments} />
                
                {/* Performance Metrics */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart4 className="h-5 w-5 mr-2 text-orrr-blue-500" />
                      Your Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MediatorPerformance stats={stats} />
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Upcoming Hearings Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orrr-teal-500" />
                  Upcoming Hearings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UpcomingHearings cases={mediatorCases} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cases">
            <Card>
              <CardHeader>
                <CardTitle>My Case Load</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between">
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      All Cases
                    </Button>
                    <Button variant="outline" size="sm">
                      Active
                    </Button>
                    <Button variant="outline" size="sm">
                      Resolved
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
                <CasesTable cases={mediatorCases} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="hearings">
            <Card>
              <CardHeader>
                <CardTitle>Hearing Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between">
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Day
                    </Button>
                    <Button variant="outline" size="sm">
                      Week
                    </Button>
                    <Button variant="outline" size="sm">
                      Month
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    Schedule New Hearing
                  </Button>
                </div>
                <div className="h-80 flex items-center justify-center text-gray-500">
                  Calendar view would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
