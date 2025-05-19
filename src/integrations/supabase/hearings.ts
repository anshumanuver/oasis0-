
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
    .from('hearings')
    .select(`
      id, 
      title,
      case_id,
      cases(title),
      scheduled_at,
      duration_minutes,
      status,
      meeting_link
    `)
    .order('scheduled_at', { ascending: true });

  if (error) {
    console.error('Error fetching upcoming hearings:', error);
    throw error;
  }

  // Transform the data to match the expected format
  const transformedData = data.map(hearing => ({
    id: hearing.id,
    title: hearing.title,
    case_id: hearing.case_id,
    case_title: hearing.cases?.title || 'Unknown Case',
    scheduled_at: hearing.scheduled_at,
    duration_minutes: hearing.duration_minutes,
    status: hearing.status,
    meeting_link: hearing.meeting_link
  }));

  return transformedData || [];
}

export type HearingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export async function updateHearingStatus(hearingId: string, status: HearingStatus) {
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
