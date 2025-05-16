
import { useCallback } from 'react';
import { createNotification, CreateNotificationParams } from '@/integrations/supabase/notifications';
import { useAuth } from '@/context/AuthContext';

export function useNotification() {
  const { user } = useAuth();
  
  const sendNotification = useCallback(async (params: Omit<CreateNotificationParams, 'recipient_id'> & { recipient_id?: string }) => {
    if (!user && !params.recipient_id) {
      console.error('No user or recipient_id provided for notification');
      return false;
    }
    
    try {
      // Use provided recipient_id or fall back to current user's id
      const recipientId = params.recipient_id || user?.id;
      
      if (!recipientId) {
        throw new Error('No recipient ID available for notification');
      }
      
      const notificationParams: CreateNotificationParams = {
        recipient_id: recipientId,
        title: params.title,
        content: params.content,
        related_to_case: params.related_to_case
      };
      
      await createNotification(notificationParams);
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }, [user]);
  
  return { sendNotification };
}
