
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

export type HearingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

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

export async function getUpcomingHearingsForUser(userId: string): Promise<HearingData[]> {
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
      meeting_link,
      description
    `)
    .order('scheduled_at', { ascending: true });

  if (error) {
    console.error('Error fetching upcoming hearings:', error);
    throw error;
  }

  // Transform the data to match the expected format and ensure status is of type HearingStatus
  const transformedData: HearingData[] = data.map(hearing => ({
    id: hearing.id,
    title: hearing.title,
    case_id: hearing.case_id,
    case_title: hearing.cases?.title || 'Unknown Case',
    scheduled_at: hearing.scheduled_at,
    duration_minutes: hearing.duration_minutes,
    status: hearing.status as HearingStatus, // Cast to ensure it matches the HearingStatus type
    meeting_link: hearing.meeting_link,
    description: hearing.description
  }));

  return transformedData || [];
}

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

// Get participants for a hearing
export async function getHearingParticipants(caseId: string): Promise<string[]> {
  // In a real implementation, this would fetch actual participants from the database
  // For now, return a mock array of participant IDs
  try {
    const { data, error } = await supabase
      .from('case_parties')
      .select('profile_id')
      .eq('case_id', caseId);
      
    if (error) throw error;
    
    // Extract participant IDs
    return data.map(party => party.profile_id) || [];
  } catch (error) {
    console.error('Error fetching hearing participants:', error);
    return [];
  }
}
