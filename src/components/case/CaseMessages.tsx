
import { useState } from 'react';
import { format } from 'date-fns';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

interface Message {
  id: string;
  sender: string;
  content: string;
  sentAt: string;
}

interface CaseMessagesProps {
  messages: Message[];
}

export default function CaseMessages({ messages }: CaseMessagesProps) {
  const [newMessage, setNewMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this message to your backend
    console.log('Sending message:', newMessage);
    // Clear the input after sending
    setNewMessage('');
  };
  
  // Sort messages by date (oldest first)
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  );
  
  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto mb-4">
        {sortedMessages.length > 0 ? (
          <div className="space-y-4">
            {sortedMessages.map((message) => (
              <Card key={message.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{message.sender}</span>
                  <time className="text-xs text-gray-500">
                    {format(new Date(message.sentAt), 'MMM d, yyyy h:mm a')}
                  </time>
                </div>
                <p className="text-gray-700">{message.content}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <div>
              <p className="mb-2">No messages in this case yet.</p>
              <p>Start the conversation by sending a message below.</p>
            </div>
          </div>
        )}
      </div>
      
      <Separator className="my-4" />
      
      {/* Message input area */}
      <form onSubmit={handleSubmit} className="mt-auto">
        <Textarea
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="min-h-[100px] mb-3"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!newMessage.trim()} className="flex items-center">
            <Send className="mr-2 h-4 w-4" /> Send Message
          </Button>
        </div>
      </form>
    </div>
  );
}
