
import { supabase } from './client';

export interface InvitationCreateDTO {
  caseId: string;
  email: string;
  phone?: string;
  invitedBy: string;
}

export interface Invitation {
  id: string;
  case_id: string;
  email: string;
  phone?: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  invited_by: string;
  expires_at: string;
  created_at: string;
  accepted_at?: string;
}

export async function createInvitation(invitationData: InvitationCreateDTO) {
  // Generate a secure token
  const { data: tokenData, error: tokenError } = await supabase
    .rpc('generate_invitation_token');

  if (tokenError) {
    console.error('Error generating token:', tokenError);
    throw tokenError;
  }

  const { data, error } = await supabase
    .from('invitations')
    .insert({
      case_id: invitationData.caseId,
      email: invitationData.email,
      phone: invitationData.phone,
      token: tokenData,
      invited_by: invitationData.invitedBy
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }

  // TODO: Send email notification to respondent with invitation link
  console.log(`Invitation created with token: ${tokenData}`);
  console.log(`Invitation link: ${window.location.origin}/invite/${tokenData}`);

  return data;
}

export async function getInvitationByToken(token: string) {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error) {
    console.error('Error fetching invitation:', error);
    throw error;
  }

  return data as Invitation;
}

export async function acceptInvitation(token: string, userId: string) {
  // First, get the invitation
  const invitation = await getInvitationByToken(token);
  
  // Update invitation status
  const { error: inviteError } = await supabase
    .from('invitations')
    .update({
      status: 'accepted',
      accepted_at: new Date().toISOString()
    })
    .eq('token', token);

  if (inviteError) {
    console.error('Error accepting invitation:', inviteError);
    throw inviteError;
  }

  // Add user as respondent to the case
  const { error: partyError } = await supabase
    .from('case_parties')
    .insert({
      case_id: invitation.case_id,
      profile_id: userId,
      party_type: 'respondent',
      invitation_id: invitation.id
    });

  if (partyError) {
    console.error('Error adding user as respondent:', partyError);
    throw partyError;
  }

  return invitation;
}

export async function getCaseInvitations(caseId: string) {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching case invitations:', error);
    throw error;
  }

  return data as Invitation[];
}
