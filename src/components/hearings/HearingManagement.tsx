
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getUpcomingHearingsForUser, updateHearingStatus } from '@/integrations/supabase/hearings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Clock, Calendar, Video, ArrowRight } from 'lucide-react';
import { formatHearingDate, getHearingTimeUntil, canJoinHearing } from '@/utils/hearingHelpers';
import HearingStatusBadge from './HearingStatusBadge';
import { HearingStatus } from '@/integrations/supabase/hearings';
import { isAfter } from 'date-fns';

interface HearingData {
  id: string;
  title: string;
  case_id: string;
  case_title: string;
  scheduled_at: string;
  duration_minutes: number;
  status: HearingStatus;
  meeting_link?: string;
}

export default function HearingManagement() {
  const [hearings, setHearings] = useState<HearingData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchHearings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await getUpcomingHearingsForUser(user.id);
        setHearings(data);
      } catch (error) {
        console.error('Error fetching hearings:', error);
        toast({
          title: 'Error',
          description: 'Could not load upcoming hearings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHearings();
    
    // Refresh data every minute to update status
    const intervalId = setInterval(fetchHearings, 60000);
    return () => clearInterval(intervalId);
  }, [user, toast]);

  const handleJoinHearing = async (hearing: HearingData) => {
    // If the hearing is scheduled to start but status is still "scheduled", update to "in_progress"
    const now = new Date();
    const hearingTime = new Date(hearing.scheduled_at);
    
    if (hearing.status === 'scheduled' && isAfter(now, hearingTime)) {
      try {
        await updateHearingStatus(hearing.id, 'in_progress');
        
        // Update local state
        setHearings(prev => 
          prev.map(h => h.id === hearing.id ? {...h, status: 'in_progress' as HearingStatus} : h)
        );
        
        toast({
          title: 'Hearing Started',
          description: `You have joined the hearing: ${hearing.title}`,
        });
      } catch (error) {
        console.error('Error updating hearing status:', error);
      }
    }
    
    // Open the meeting link in a new tab
    if (hearing.meeting_link) {
      window.open(hearing.meeting_link, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hearing Management</CardTitle>
        <CardDescription>
          Manage and join your upcoming hearings
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : hearings.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="font-medium text-lg">No upcoming hearings</h3>
            <p className="text-sm mt-1">You don't have any hearings scheduled yet</p>
          </div>
        ) : (
          <div className="space-y-5">
            {hearings.map((hearing) => (
              <div key={hearing.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{hearing.title}</h3>
                      <HearingStatusBadge status={hearing.status} scheduledAt={hearing.scheduled_at} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Case: {hearing.case_title}
                    </p>
                  </div>
                  <div className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {getHearingTimeUntil(hearing.scheduled_at)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span>{formatHearingDate(hearing.scheduled_at)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <span>{hearing.duration_minutes} minutes</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/cases/${hearing.case_id}`)}
                  >
                    View Case
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  
                  {canJoinHearing(hearing.status, hearing.scheduled_at, hearing.meeting_link) ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleJoinHearing(hearing)}
                      className="gap-1"
                    >
                      <Video className="h-4 w-4" />
                      Join Hearing
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" disabled>
                      <Video className="mr-1 h-4 w-4" />
                      {hearing.status === 'scheduled' ? 'Join (Not Available Yet)' : 'Not Available'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <div className="text-center pt-2">
              <Button variant="link" onClick={() => navigate('/hearings')}>
                View All Hearings
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
