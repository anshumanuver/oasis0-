
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast'; 
import { updateHearingStatus, HearingStatus } from '@/integrations/supabase/hearings';
import { useNotification } from './use-notification';
import { useAuth } from '@/context/AuthContext';

export function useHearingStatus() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { sendNotification } = useNotification();
  const { user } = useAuth();
  
  const changeHearingStatus = async (
    hearingId: string, 
    status: HearingStatus, 
    caseId: string,
    hearingTitle: string,
    participantIds: string[]
  ) => {
    if (!user) return null;
    
    setIsUpdating(true);
    try {
      // Update the hearing status
      const updatedHearing = await updateHearingStatus(hearingId, status);
      
      // Display toast notification
      toast({
        title: "Hearing Status Updated",
        description: `The hearing has been marked as ${status}`,
      });
      
      // Send notifications to all participants
      const statusMessages = {
        scheduled: "scheduled",
        in_progress: "started",
        completed: "completed",
        cancelled: "cancelled"
      };
      
      // Send notifications to all participants except the current user
      participantIds.forEach(participantId => {
        if (participantId !== user.id) {
          sendNotification({
            recipient_id: participantId,
            title: "Hearing Status Updated",
            content: `The hearing "${hearingTitle}" has been ${statusMessages[status]}`,
            related_to_case: caseId
          });
        }
      });
      
      return updatedHearing;
    } catch (error) {
      console.error(`Error updating hearing status to ${status}:`, error);
      toast({
        title: "Error",
        description: `Failed to update hearing status. Please try again.`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    changeHearingStatus,
    isUpdating
  };
}
