
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { HearingStatus as HearingStatusType } from '@/integrations/supabase/hearings';
import { useHearingStatus } from '@/hooks/use-hearing-status';

interface HearingStatusProps {
  status: HearingStatusType;
  hearingId: string;
  caseId: string;
  hearingTitle: string;
  participantIds: string[];
  isOwner: boolean;
  scheduledAt: string;
}

export default function HearingStatus({ 
  status, 
  hearingId, 
  caseId,
  hearingTitle,
  participantIds,
  isOwner,
  scheduledAt
}: HearingStatusProps) {
  const { changeHearingStatus, isUpdating } = useHearingStatus();
  const now = new Date();
  const hearingTime = new Date(scheduledAt);
  const hearingEndTime = new Date(hearingTime.getTime() + 15 * 60000); // 15 min buffer
  
  // Determine if hearing is currently live
  const isLive = status === 'scheduled' && 
    now >= hearingTime && 
    now <= hearingEndTime;
    
  // Only allow status updates if user is owner
  const handleStatusChange = async (newStatus: HearingStatusType) => {
    await changeHearingStatus(hearingId, newStatus, caseId, hearingTitle, participantIds);
  };
  
  const renderStatusBadge = () => {
    if (isLive) {
      return <Badge className="bg-red-500">Live Now</Badge>;
    }
    
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-500">In Progress</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Scheduled</Badge>;
    }
  };
  
  // Don't show dropdown for non-owners or completed/cancelled hearings
  if (!isOwner || status === 'completed' || status === 'cancelled') {
    return renderStatusBadge();
  }
  
  return (
    <div className="flex items-center gap-2">
      {renderStatusBadge()}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            disabled={isUpdating}
          >
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Change status</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleStatusChange('in_progress')}
            disabled={status === 'in_progress'}
          >
            Mark as In Progress
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange('completed')}
            disabled={status === 'completed'}
          >
            Mark as Completed
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange('cancelled')}
            disabled={status === 'cancelled'}
          >
            Cancel Hearing
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
