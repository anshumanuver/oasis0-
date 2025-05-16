import { format, isAfter, differenceInDays } from 'date-fns';

export const formatHearingDate = (dateString: string): string => {
  const now = new Date();
  const hearingDate = new Date(dateString);
  
  // If today
  if (now.toDateString() === hearingDate.toDateString()) {
    return `Today at ${format(hearingDate, 'h:mm a')}`;
  }
  
  // If tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (tomorrow.toDateString() === hearingDate.toDateString()) {
    return `Tomorrow at ${format(hearingDate, 'h:mm a')}`;
  }
  
  // If within the next 7 days
  const daysUntil = differenceInDays(hearingDate, now);
  if (daysUntil < 7) {
    return `${format(hearingDate, 'EEEE')} at ${format(hearingDate, 'h:mm a')}`;
  }
  
  // Otherwise full date
  return format(hearingDate, 'MMM d, yyyy - h:mm a');
};

export const getHearingTimeUntil = (dateString: string): string => {
  const now = new Date();
  const hearingTime = new Date(dateString);
  
  if (!isAfter(hearingTime, now)) {
    return 'Now';
  }
  
  const diffMs = hearingTime.getTime() - now.getTime();
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
