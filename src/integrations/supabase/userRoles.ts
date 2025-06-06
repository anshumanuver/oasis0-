
import { supabase } from './client';

export type UserRole = 'admin' | 'neutral' | 'client';

export interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  assigned_at: string;
  assigned_by?: string;
  is_active: boolean;
}

export async function getUserRoles(userId: string): Promise<UserRoleData[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }

  return data || [];
}

export async function getUserPrimaryRole(userId: string): Promise<UserRole | null> {
  const { data, error } = await supabase
    .rpc('get_user_role', { _user_id: userId });

  if (error) {
    console.error('Error fetching user primary role:', error);
    return null;
  }

  return data;
}

export async function hasRole(userId: string, role: UserRole): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('has_role', { _user_id: userId, _role: role });

  if (error) {
    console.error('Error checking user role:', error);
    return false;
  }

  return data || false;
}

export async function assignRole(userId: string, role: UserRole, assignedBy?: string): Promise<void> {
  const { error } = await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      role: role,
      assigned_by: assignedBy
    });

  if (error) {
    console.error('Error assigning role:', error);
    throw error;
  }
}

export async function removeRole(userId: string, role: UserRole): Promise<void> {
  const { error } = await supabase
    .from('user_roles')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('role', role);

  if (error) {
    console.error('Error removing role:', error);
    throw error;
  }
}
