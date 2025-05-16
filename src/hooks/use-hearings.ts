
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getUpcomingHearingsForUser, HearingStatus } from '@/integrations/supabase/hearings';

export interface HearingData {
  id: string;
  title: string;
  case_id: string;
  case_title: string;
  scheduled_at: string;
  duration_minutes: number;
  status: HearingStatus;
  meeting_link?: string;
  description?: string;
  participant_ids: string[];
}

export function useHearings() {
  const [hearings, setHearings] = useState<HearingData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchHearings = async () => {
      setLoading(true);
      try {
        const data = await getUpcomingHearingsForUser(user.id);
        setHearings(data);
      } catch (error) {
        console.error('Error fetching hearings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHearings();
    
    // Subscribe to realtime changes for hearings
    const channel = supabase
      .channel('public:hearings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hearings'
        },
        () => {
          // Refresh hearings when any change occurs
          fetchHearings();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  // Filter hearings based on their status and date
  const upcomingHearings = hearings
    .filter(h => h.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
    
  const activeHearings = hearings
    .filter(h => h.status === 'in_progress')
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
    
  const completedHearings = hearings
    .filter(h => h.status === 'completed')
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());
    
  const cancelledHearings = hearings
    .filter(h => h.status === 'cancelled')
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());
  
  return {
    hearings,
    upcomingHearings,
    activeHearings,
    completedHearings,
    cancelledHearings,
    loading
  };
}
