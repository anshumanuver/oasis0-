
import { supabase } from './client';
import type { DisputeType } from '@/types';

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

  return data;
}
