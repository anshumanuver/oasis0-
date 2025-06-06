
import { supabase } from './client';
import type { DisputeType, CaseStatus } from '@/types';

export interface CaseCreateDTO {
  title: string;
  description: string;
  disputeType: DisputeType;
  createdBy: string;
}

export async function createCase(caseData: CaseCreateDTO) {
  const { data, error } = await supabase
    .from('cases')
    .insert({
      title: caseData.title,
      description: caseData.description,
      case_type: caseData.disputeType,
      created_by: caseData.createdBy,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating case:', error);
    throw error;
  }

  // Add the new case to the case_parties table to establish the relationship
  // between the case creator and the case
  if (data) {
    const { error: partyError } = await supabase
      .from('case_parties')
      .insert({
        case_id: data.id,
        profile_id: caseData.createdBy,
        party_type: 'claimant'
      });
      
    if (partyError) {
      console.error('Error creating case party relationship:', partyError);
    }
  }

  return data;
}

// Function to fetch cases for the current user (or all cases for admin)
export async function fetchUserCases(userId: string, userRole: string | null = null) {
  // If admin, fetch all cases
  if (userRole === 'admin') {
    const { data: allCases, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all cases:', error);
      throw error;
    }

    return (allCases || []).map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      disputeType: c.case_type as DisputeType,
      status: c.status as CaseStatus,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      createdBy: c.created_by,
      resolvedAt: c.resolved_at,
      parties: [],
      documents: [],
      messages: [],
      events: [],
      nextHearingDate: undefined
    }));
  }

  // For regular users, get cases where they are creator or party
  const { data: createdCases, error: createdError } = await supabase
    .from('cases')
    .select('*')
    .eq('created_by', userId);

  if (createdError) {
    console.error('Error fetching created cases:', createdError);
    throw createdError;
  }

  // Then get cases where the user is a party
  const { data: partyCases, error: partyError } = await supabase
    .from('case_parties')
    .select('case_id')
    .eq('profile_id', userId);

  if (partyError) {
    console.error('Error fetching party cases:', partyError);
    throw partyError;
  }

  // If there are party cases, fetch the full case details
  let additionalCases = [];
  if (partyCases && partyCases.length > 0) {
    const caseIds = partyCases.map(p => p.case_id);
    const { data: cases, error } = await supabase
      .from('cases')
      .select('*')
      .in('id', caseIds);

    if (error) {
      console.error('Error fetching additional cases:', error);
    } else if (cases) {
      additionalCases = cases;
    }
  }

  // Combine and deduplicate cases
  const allCases = [...(createdCases || []), ...additionalCases];
  const uniqueCases = Array.from(new Map(allCases.map(c => [c.id, c])).values());
  
  // Map the database column names to our frontend property names
  return uniqueCases.map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    disputeType: c.case_type as DisputeType,
    status: c.status as CaseStatus,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    createdBy: c.created_by,
    resolvedAt: c.resolved_at,
    parties: [],
    documents: [],
    messages: [],
    events: [],
    nextHearingDate: undefined
  }));
}

export async function fetchCaseDetails(caseId: string) {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('id', caseId)
    .single();

  if (error) {
    console.error('Error fetching case details:', error);
    throw error;
  }

  // Map the database response to our frontend Case type
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    disputeType: data.case_type as DisputeType,
    status: data.status as CaseStatus,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdBy: data.created_by,
    resolvedAt: data.resolved_at,
    parties: [],
    documents: [],
    messages: [],
    events: [],
    nextHearingDate: undefined
  };
}

export async function getUserRoleInCase(caseId: string, userId: string): Promise<'claimant' | 'respondent' | 'neutral' | null> {
  // Check if user is case creator (claimant)
  const { data: caseData } = await supabase
    .from('cases')
    .select('created_by')
    .eq('id', caseId)
    .single();
    
  if (caseData?.created_by === userId) {
    return 'claimant';
  }

  // Check if user is a party in the case
  const { data: partyData } = await supabase
    .from('case_parties')
    .select('party_type')
    .eq('case_id', caseId)
    .eq('profile_id', userId)
    .single();

  if (partyData) {
    return partyData.party_type as 'claimant' | 'respondent' | 'neutral';
  }

  return null;
}
