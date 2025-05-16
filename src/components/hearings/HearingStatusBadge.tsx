
import { Badge } from '@/components/ui/badge';
import { HearingStatus } from '@/integrations/supabase/hearings';
import { getStatusBadgeVariant } from '@/utils/hearingHelpers';

interface HearingStatusBadgeProps {
  status: HearingStatus;
  scheduledAt: string;
  className?: string;
}

export default function HearingStatusBadge({ 
  status, 
  scheduledAt,
  className = ''
}: HearingStatusBadgeProps) {
  const badgeVariant = getStatusBadgeVariant(status, scheduledAt);
  
  if (badgeVariant === 'live') {
    return <Badge className={`bg-red-500 ${className}`}>Live Now</Badge>;
  }
  
  switch (status) {
    case 'scheduled':
      return <Badge variant="outline" className={className}>Scheduled</Badge>;
    case 'in_progress':
      return <Badge className={`bg-amber-500 ${className}`}>In Progress</Badge>;
    case 'completed':
      return <Badge variant="secondary" className={className}>Completed</Badge>;
    case 'cancelled':
      return <Badge variant="destructive" className={className}>Cancelled</Badge>;
    default:
      return <Badge variant="outline" className={className}>Scheduled</Badge>;
  }
}
