
import { useAuth } from '@/context/AuthContext';
import { createNotification, CreateNotificationDTO } from '@/integrations/supabase/notifications';

export function useNotification() {
  const { user } = useAuth();
  
  const sendNotification = async ({
    recipientId,
    title,
    content,
    relatedToCaseId
  }: Omit<CreateNotificationDTO, 'recipientId'> & { recipientId?: string }) => {
    // Use provided recipient ID or fall back to current user
    const recipient = recipientId || user?.id;
    
    if (!recipient) {
      console.error("Cannot send notification: No recipient ID provided and no user logged in");
      return null;
    }
    
    try {
      const notification = await createNotification({
        recipientId: recipient,
        title,
        content,
        relatedToCaseId
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
