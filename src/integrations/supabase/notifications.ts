
import { supabase } from './client';

export interface CreateNotificationDTO {
  recipientId: string;
  title: string;
  content: string;
  relatedToCaseId?: string;
}

export async function createNotification(notificationData: CreateNotificationDTO) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      recipient_id: notificationData.recipientId,
      title: notificationData.title,
      content: notificationData.content,
      related_to_case: notificationData.relatedToCaseId,
      is_read: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }

  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }

  return data;
}

export async function markAllNotificationsAsRead(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('recipient_id', userId)
    .eq('is_read', false)
    .select();

  if (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }

  return data;
}

export async function getNotificationsCount(userId: string) {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error getting notifications count:', error);
    throw error;
  }

  return count || 0;
}
