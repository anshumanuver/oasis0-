
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHearings } from '@/hooks/use-hearings';
import HearingCard from '@/components/hearings/HearingCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock } from 'lucide-react';
import { useHearingStatus } from '@/hooks/use-hearing-status';

export default function HearingOverview() {
  const { 
    hearings, 
    upcomingHearings, 
    activeHearings, 
    completedHearings,
    loading 
  } = useHearings();
  const navigate = useNavigate();
  const { changeHearingStatus } = useHearingStatus();
  const { toast } = useToast();
  
  const handleJoinHearing = async (hearingId: string) => {
    const hearing = hearings.find(h => h.id === hearingId);
    if (!hearing) return;
    
    if (hearing.status === 'scheduled') {
      // Update status to in_progress when joining
      await changeHearingStatus(
        hearingId, 
        'in_progress', 
        hearing.case_id, 
        hearing.title, 
        hearing.participant_ids
      );
    }
    
    // Open the meeting link in a new tab
    if (hearing.meeting_link) {
      window.open(hearing.meeting_link, '_blank');
    } else {
      toast({
        title: "No Meeting Link",
        description: "This hearing doesn't have a meeting link.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>Your Hearings</span>
          <Button variant="outline" size="sm" onClick={() => navigate('/hearings/new')}>
            Schedule Hearing
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingHearings.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeHearings.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedHearings.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : upcomingHearings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>No upcoming hearings</p>
              </div>
            ) : (
              upcomingHearings.slice(0, 3).map(hearing => (
                <HearingCard
                  key={hearing.id}
                  id={hearing.id}
                  title={hearing.title}
                  caseId={hearing.case_id}
                  caseTitle={hearing.case_title}
                  scheduledAt={hearing.scheduled_at}
                  duration={hearing.duration_minutes}
                  status={hearing.status}
                  meetingLink={hearing.meeting_link}
                  participantCount={hearing.participant_ids.length || 1}
                  onJoinHearing={() => handleJoinHearing(hearing.id)}
                  compact
                />
              ))
            )}
            {upcomingHearings.length > 3 && (
              <div className="text-center mt-4">
                <Button variant="link" onClick={() => navigate('/hearings')}>
                  View all ({upcomingHearings.length}) hearings
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : activeHearings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>No active hearings</p>
              </div>
            ) : (
              activeHearings.slice(0, 3).map(hearing => (
                <HearingCard
                  key={hearing.id}
                  id={hearing.id}
                  title={hearing.title}
                  caseId={hearing.case_id}
                  caseTitle={hearing.case_title}
                  scheduledAt={hearing.scheduled_at}
                  duration={hearing.duration_minutes}
                  status={hearing.status}
                  meetingLink={hearing.meeting_link}
                  participantCount={hearing.participant_ids.length || 1}
                  onJoinHearing={() => handleJoinHearing(hearing.id)}
                  compact
                />
              ))
            )}
            {activeHearings.length > 3 && (
              <div className="text-center mt-4">
                <Button variant="link" onClick={() => navigate('/hearings')}>
                  View all ({activeHearings.length}) active hearings
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : completedHearings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>No completed hearings</p>
              </div>
            ) : (
              completedHearings.slice(0, 3).map(hearing => (
                <HearingCard
                  key={hearing.id}
                  id={hearing.id}
                  title={hearing.title}
                  caseId={hearing.case_id}
                  caseTitle={hearing.case_title}
                  scheduledAt={hearing.scheduled_at}
                  duration={hearing.duration_minutes}
                  status={hearing.status}
                  meetingLink={hearing.meeting_link}
                  participantCount={hearing.participant_ids.length || 1}
                  compact
                />
              ))
            )}
            {completedHearings.length > 3 && (
              <div className="text-center mt-4">
                <Button variant="link" onClick={() => navigate('/hearings')}>
                  View all ({completedHearings.length}) completed hearings
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
