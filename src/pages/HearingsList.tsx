
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Clock, Calendar, Video, Users } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { mockCases } from '@/data/mockData';
import { Case, Hearing } from '@/types';

export default function HearingsList() {
  const { user } = useAuth();
  const [hearings, setHearings] = useState<(Hearing & { case: Case })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHearings = () => {
      setLoading(true);
      
      // In a real app, you would call your API to fetch hearings
      // For now, we'll extract hearings from mock cases
      try {
        const extractedHearings = mockCases.flatMap(caseItem => {
          return (caseItem.hearings || []).map(hearing => ({
            ...hearing,
            case: caseItem
          }));
        });
        
        setHearings(extractedHearings);
      } catch (error) {
        console.error('Error fetching hearings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHearings();
  }, []);

  const now = new Date();
  const upcomingHearings = hearings.filter(h => 
    h.scheduledAt && new Date(h.scheduledAt) > now
  ).sort((a, b) => {
    const dateA = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0;
    const dateB = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0;
    return dateA - dateB;
  });
  
  const pastHearings = hearings.filter(h => 
    h.scheduledAt && new Date(h.scheduledAt) <= now
  ).sort((a, b) => {
    const dateA = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0;
    const dateB = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0;
    return dateB - dateA; // Descending order for past hearings
  });

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP p');
  };

  const getTimeUntil = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const hearingDate = new Date(dateString);
    const now = new Date();
    const diffMs = hearingDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Now';
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} from now`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} from now`;
    } else {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} from now`;
    }
  };

  const HearingCard = ({ hearing }: { hearing: Hearing & { case: Case } }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{hearing.title}</h3>
            <p className="text-sm text-gray-500">
              Case: <Link to={`/cases/${hearing.caseId}`} className="text-primary hover:underline">
                {hearing.case.title}
              </Link>
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDateTime(hearing.scheduledAt)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {hearing.duration} minutes
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {hearing.case.parties.length} participants
              </div>
            </div>
            
            {hearing.description && (
              <p className="text-sm mt-2">{hearing.description}</p>
            )}
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2">
            {hearing.scheduledAt && new Date(hearing.scheduledAt) > now && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                {getTimeUntil(hearing.scheduledAt)}
              </span>
            )}
            
            {hearing.meetingLink && new Date(hearing.scheduledAt || '') > now && (
              <Button size="sm" className="mt-2">
                <Video className="h-4 w-4 mr-2" />
                Join Meeting
              </Button>
            )}
            
            {hearing.scheduledAt && new Date(hearing.scheduledAt) <= now && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                Completed
              </span>
            )}
            
            <Button variant="outline" size="sm" asChild className="mt-1">
              <Link to={`/cases/${hearing.caseId}`}>
                View Case
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Hearings</h1>
          <Button asChild>
            <Link to="/hearings/new">Schedule Hearing</Link>
          </Button>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingHearings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastHearings.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : upcomingHearings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No upcoming hearings</h3>
                <p className="text-gray-500 mt-1">You don't have any hearings scheduled</p>
                <Button className="mt-4" asChild>
                  <Link to="/hearings/new">Schedule a Hearing</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingHearings.map((hearing) => (
                  <HearingCard key={hearing.id} hearing={hearing} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : pastHearings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No past hearings</h3>
                <p className="text-gray-500 mt-1">You haven't attended any hearings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastHearings.map((hearing) => (
                  <HearingCard key={hearing.id} hearing={hearing} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
