
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Case } from '@/types';

interface PartyMessagingWidgetProps {
  partyCases: Case[];
}

export default function PartyMessagingWidget({ partyCases }: PartyMessagingWidgetProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get all messages from all cases
  const allMessages = partyCases.flatMap(caseItem => 
    caseItem.messages.map(message => ({
      ...message,
      caseTitle: caseItem.title,
      caseId: caseItem.id
    }))
  );
  
  // Sort by date and take most recent 3
  const recentMessages = allMessages
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);
    
  if (recentMessages.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Messages</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => navigate('/messages')}
          >
            <span className="sr-only">View all messages</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <MessageSquare className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No messages yet</p>
            <Button 
              variant="link" 
              className="mt-2 p-0 h-auto"
              onClick={() => navigate('/messages')}
            >
              Start a conversation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Messages</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => navigate('/messages')}
        >
          <span className="sr-only">View all messages</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentMessages.map((message) => (
            <div 
              key={message.id} 
              className="border-b pb-3 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded"
              onClick={() => navigate(`/messages?case=${message.caseId}`)}
            >
              <p className="text-sm font-medium mb-1 truncate">{message.sender}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{message.content}</p>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-primary">{message.caseTitle}</span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={() => navigate('/messages')}
          >
            View all messages
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
