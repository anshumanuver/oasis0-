
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHearings } from '@/hooks/use-hearings';

export default function UpcomingHearingsWidget() {
  const { upcomingHearings, loading } = useHearings();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntil = (dateString: string) => {
    const hearingDate = new Date(dateString);
    const now = new Date();
    const diffMs = hearingDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Now';
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} from now`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} from now`;
    } else {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} from now`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Upcoming Hearings</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : upcomingHearings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No upcoming hearings scheduled
          </div>
        ) : (
          <div className="space-y-5">
            {upcomingHearings.slice(0, 5).map((hearing) => (
              <div key={hearing.id} className="flex flex-col space-y-2 pb-5 border-b last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{hearing.title}</h4>
                    <p className="text-sm text-gray-500">
                      Case: <Link to={`/cases/${hearing.case_id}`} className="text-orrr-blue-600 hover:underline">
                        {hearing.case_title}
                      </Link>
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-orrr-blue-100 text-orrr-blue-800">
                    {getTimeUntil(hearing.scheduled_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDateTime(hearing.scheduled_at)} • {hearing.duration_minutes} mins
                  </div>
                  {hearing.meeting_link && (
                    <Button size="sm" asChild>
                      <a href={hearing.meeting_link} target="_blank" rel="noopener noreferrer">
                        Join
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {upcomingHearings.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="link" asChild>
                  <Link to="/hearings">View all hearings</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
