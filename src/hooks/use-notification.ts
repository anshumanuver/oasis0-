
import { useAuth } from '@/context/AuthContext';
import { createNotification, CreateNotificationParams } from '@/integrations/supabase/notifications';

export function useNotification() {
  const { user } = useAuth();
  
  const sendNotification = async ({
    recipient_id,
    title,
    content,
    related_to_case
  }: Omit<CreateNotificationParams, "recipient_id"> & { recipient_id?: string }) => {
    // Use provided recipient ID or fall back to current user
    const recipient = recipient_id || user?.id;
    
    if (!recipient) {
      console.error("Cannot send notification: No recipient ID provided and no user logged in");
      return null;
    }
    
    try {
      const notification = await createNotification({
        recipient_id: recipient,
        title,
        content,
        related_to_case
      });
      
      return notification;
    } catch (error) {
      console.error("Failed to send notification:", error);
      return null;
    }
  };
  
  return {
    sendNotification
  };
}
