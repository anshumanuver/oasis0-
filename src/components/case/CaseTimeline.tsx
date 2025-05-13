
import { format } from 'date-fns';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface CaseTimelineProps {
  events: TimelineEvent[];
}

export default function CaseTimeline({ events }: CaseTimelineProps) {
  // Sort events by date (newest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:left-4 before:w-0.5 before:-ml-px before:bg-gray-200 before:h-full">
      {sortedEvents.map((event, index) => (
        <div key={event.id} className="relative pl-8">
          <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="h-2.5 w-2.5 rounded-full bg-primary"></span>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <time className="text-xs font-medium text-gray-500">
              {format(new Date(event.date), 'MMM d, yyyy h:mm a')}
            </time>
            <h3 className="text-base font-medium mt-1">{event.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
          </div>
        </div>
      ))}
      
      {events.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No events have been recorded for this case yet.
        </div>
      )}
    </div>
  );
}
