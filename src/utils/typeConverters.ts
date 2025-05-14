
import { Event, TimelineEvent, Message } from '@/types';

/**
 * Converts Event objects to TimelineEvent objects for use with CaseTimeline component
 */
export const convertToTimelineEvents = (events: Event[]): TimelineEvent[] => {
  return events.map(event => ({
    id: event.id,
    title: event.title || event.type,
    description: event.description,
    date: event.date
  }));
};

/**
 * Converts Message objects for use with CaseMessages component
 */
export const convertToCaseMessages = (messages: Message[]): any[] => {
  return messages.map(message => ({
    id: message.id,
    sender: message.sender || message.senderId,
    content: message.content,
    sentAt: message.sentAt || message.timestamp
  }));
};
