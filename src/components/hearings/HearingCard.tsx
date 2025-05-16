
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatHearingDate, getHearingTimeUntil, canJoinHearing } from "@/utils/hearingHelpers";
import { HearingStatus } from '@/integrations/supabase/hearings';
import { Clock, Calendar, Video, Users } from 'lucide-react';
import HearingStatusBadge from './HearingStatusBadge';

interface HearingCardProps {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  status: HearingStatus;
  caseId: string;
  caseTitle: string;
  description?: string;
  meetingLink?: string;
  participantCount: number;
  onJoinHearing?: () => void;
  showJoinButton?: boolean;
  isCompact?: boolean;
}

export default function HearingCard({
  id,
  title,
  scheduledAt,
  duration,
  status,
  caseId,
  caseTitle,
  description,
  meetingLink,
  participantCount,
  onJoinHearing,
  showJoinButton = true,
  isCompact = false
}: HearingCardProps) {
  const now = new Date();
  const hearingDate = new Date(scheduledAt);
  const isPast = now > hearingDate;
  const canJoin = showJoinButton && canJoinHearing(status, scheduledAt, meetingLink);

  if (isCompact) {
    return (
      <div className="border-b last:border-b-0 pb-4 mb-4 last:mb-0">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm">{title}</h3>
              <HearingStatusBadge status={status} scheduledAt={scheduledAt} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Case: <Link to={`/cases/${caseId}`} className="hover:underline text-blue-600">
                {caseTitle}
              </Link>
            </p>
          </div>
          <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
            {getHearingTimeUntil(scheduledAt)}
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{formatHearingDate(scheduledAt)}</span>
          </div>
          
          {canJoin && (
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onJoinHearing}>
              <Video className="h-3 w-3 mr-1" />
              Join
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{title}</h3>
              <HearingStatusBadge status={status} scheduledAt={scheduledAt} />
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
            
            {description && (
              <p className="text-sm mt-2">{description}</p>
            )}
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2">
            {!isPast && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                {getHearingTimeUntil(scheduledAt)}
              </span>
            )}
            
            <div className="mt-2 space-x-2">
              {canJoin && (
                <Button size="sm" onClick={onJoinHearing} className="gap-1">
                  <Video className="h-4 w-4" />
                  Join Hearing
                </Button>
              )}
              
              <Button variant="outline" size="sm" asChild>
                <Link to={`/cases/${caseId}`}>
                  View Case
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
