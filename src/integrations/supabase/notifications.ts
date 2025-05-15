
import { supabase } from './client';

export interface CreateNotificationParams {
  recipient_id: string;
  title: string;
  content: string;
  related_to_case?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      recipient_id: params.recipient_id,
      title: params.title,
      content: params.content,
      related_to_case: params.related_to_case || null,
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

export async function getUnreadNotificationsCount(userId: string) {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error counting unread notifications:', error);
    throw error;
  }

  return count || 0;
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
    .eq('is_read', false);

  if (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }

  return data;
}

export async function deleteNotification(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

export async function setupNotificationsForHearing(hearingId: string, caseId: string, partyIds: string[], neutralId?: string) {
  // Get hearing details
  const { data: hearingData, error: hearingError } = await supabase
    .from('hearings')
    .select('*')
    .eq('id', hearingId)
    .single();
    
  if (hearingError) {
    console.error('Error fetching hearing details:', hearingError);
    throw hearingError;
  }
  
  const title = 'New Hearing Scheduled';
  const content = `A hearing for case "${hearingData.title}" has been scheduled for ${new Date(hearingData.scheduled_at).toLocaleString()}`;
  
  // Create notifications for all parties
  const notifications = partyIds.map(partyId => ({
    recipient_id: partyId,
    title,
    content,
    related_to_case: caseId
  }));
  
  // Add notification for neutral if provided
  if (neutralId) {
    notifications.push({
      recipient_id: neutralId,
      title,
      content,
      related_to_case: caseId
    });
  }
  
  // Insert all notifications
  const { data, error } = await supabase
    .from('notifications')
    .insert(notifications)
    .select();
    
  if (error) {
    console.error('Error creating hearing notifications:', error);
    throw error;
  }
  
  return data;
}
