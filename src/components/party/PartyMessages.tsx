import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Case } from '@/types';
import { Button } from '@/components/ui/button';

interface PartyMessagesProps {
  partyCases: Case[];
}

export default function PartyMessages({ partyCases }: PartyMessagesProps) {
  // Get all messages from all cases
  const allMessages = partyCases.flatMap(caseItem => 
    caseItem.messages.map(message => ({
      ...message,
      caseTitle: caseItem.title,
      caseId: caseItem.id
    }))
  );
  
  // Sort by date and take most recent 5
  const recentMessages = allMessages
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
    
  if (recentMessages.length === 0) {
    return <div className="text-gray-500 text-center py-4">No messages yet</div>;
  }

  return (
    <div className="space-y-4">
      {recentMessages.map((message) => (
        <div key={message.id} className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.sender}`} />
            <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">{message.sender}</p>
              <p className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString(undefined, { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </p>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">{message.content}</p>
            <a 
              href={`/cases/${message.caseId}`}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              View in {message.caseTitle}
            </a>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-2">
        <Button variant="link" asChild className="text-xs">
          <a href="/messages">View all messages</a>
        </Button>
      </div>
    </div>
  );
}
