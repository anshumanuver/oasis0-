
import { supabase } from './client';

export interface HearingCreateDTO {
  caseId: string;
  title: string;
  scheduledAt: string;
  duration: number;
  description?: string;
  meetingLink?: string;
  meetingPassword?: string;
  scheduledBy: string;
}

export async function createHearing(hearingData: HearingCreateDTO) {
  const { data, error } = await supabase
    .from('hearings')
    .insert({
      case_id: hearingData.caseId,
      title: hearingData.title,
      scheduled_at: hearingData.scheduledAt,
      duration_minutes: hearingData.duration,
      description: hearingData.description || null,
      meeting_link: hearingData.meetingLink || null,
      meeting_password: hearingData.meetingPassword || null,
      scheduled_by: hearingData.scheduledBy,
      status: 'scheduled'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating hearing:', error);
    throw error;
  }

  return data;
}

export async function getHearingsByCaseId(caseId: string) {
  const { data, error } = await supabase
    .from('hearings')
    .select('*')
    .eq('case_id', caseId)
    .order('scheduled_at', { ascending: true });

  if (error) {
    console.error('Error fetching hearings:', error);
    throw error;
  }

  return data || [];
}

export async function getUpcomingHearingsForUser(userId: string) {
  const { data, error } = await supabase
    .rpc('get_upcoming_hearings_for_user', {
      user_id: userId
    });

  if (error) {
    console.error('Error fetching upcoming hearings:', error);
    throw error;
  }

  return data || [];
}

export async function updateHearingStatus(hearingId: string, status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled') {
  const { data, error } = await supabase
    .from('hearings')
    .update({ status })
    .eq('id', hearingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating hearing status:', error);
    throw error;
  }

  return data;
}
