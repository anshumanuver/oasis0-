
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Clock, Users, ArrowRight, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { formatHearingDate, getHearingTimeUntil, canJoinHearing } from '@/utils/hearingHelpers';
import HearingStatusBadge from './HearingStatusBadge';
import { HearingStatus } from '@/integrations/supabase/hearings';

interface HearingCardProps {
  id: string;
  title: string;
  caseId: string;
  caseTitle: string;
  scheduledAt: string;
  duration: number;
  description?: string;
  status: HearingStatus;
  meetingLink?: string;
  participantCount: number;
  onJoinHearing?: () => void;
  compact?: boolean;
}

export default function HearingCard({
  id,
  title,
  caseId,
  caseTitle,
  scheduledAt,
  duration,
  description,
  status,
  meetingLink,
  participantCount,
  onJoinHearing,
  compact = false
}: HearingCardProps) {
  const now = new Date();
  const hearingTime = new Date(scheduledAt);
  const canJoin = canJoinHearing(status, scheduledAt, meetingLink);
  const isPast = hearingTime < now && (status === 'completed' || status === 'cancelled');
  
  return (
    <Card className={compact ? "mb-2" : "mb-4"}>
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className={compact ? "text-base font-medium" : "text-xl font-semibold"}>{title}</h3>
              <HearingStatusBadge status={status} scheduledAt={scheduledAt} className="ml-2" />
            </div>
            
            <p className="text-sm text-gray-500">
              Case: <Link to={`/cases/${caseId}`} className="text-primary hover:underline">
                {caseTitle}
              </Link>
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatHearingDate(scheduledAt)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {duration} minutes
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {participantCount} participants
              </div>
            </div>
            
            {description && !compact && (
              <p className="text-sm mt-2">{description}</p>
            )}
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2">
            {!isPast && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                {getHearingTimeUntil(scheduledAt)}
              </span>
            )}
            
            {canJoin && onJoinHearing && (
              <Button size="sm" onClick={onJoinHearing} className="mt-2">
                <Video className="h-4 w-4 mr-2" />
                Join Meeting
              </Button>
            )}
            
            <Button variant="outline" size="sm" asChild className="mt-1">
              <Link to={`/cases/${caseId}`}>
                <ArrowRight className="h-4 w-4 mr-2" />
                View Case
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
