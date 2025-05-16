
import { HearingStatus } from '@/integrations/supabase/hearings';

export function getHearingStatusColor(status: HearingStatus): string {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-amber-100 text-amber-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function canJoinHearing(scheduledAt: string, status: HearingStatus): boolean {
  const now = new Date();
  const hearingTime = new Date(scheduledAt);
  
  // Allow joining 15 minutes before the scheduled time
  const joinWindow = new Date(hearingTime);
  joinWindow.setMinutes(joinWindow.getMinutes() - 15);
  
  return (status === 'scheduled' || status === 'in_progress') && now >= joinWindow;
}

export function formatHearingDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
    }
  }
}
