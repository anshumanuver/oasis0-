
import { useCallback } from 'react';
import { createNotification, CreateNotificationParams } from '@/integrations/supabase/notifications';

export function useNotification() {
  const sendNotification = useCallback(async (params: CreateNotificationParams) => {
    try {
      await createNotification(params);
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }, []);
  
  return { sendNotification };
}
