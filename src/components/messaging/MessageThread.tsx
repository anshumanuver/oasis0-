
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface MessageProps {
  caseId: string;
  threadId?: string;
  onBack?: () => void;
  recipientId?: string;
  recipientName?: string;
}

export default function MessageThread({ 
  caseId, 
  threadId, 
  onBack,
  recipientId,
  recipientName 
}: MessageProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages for this case/thread
  useEffect(() => {
    if (!caseId || !user?.id) return;
    
    setLoading(true);
    
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*, sender:profiles!sender_id(first_name, last_name, email)')
          .eq('case_id', caseId)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Error fetching messages',
          description: 'Please try again later',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel(`case_messages:${caseId}`)
      .on('postgres_changes', { 
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `case_id=eq.${caseId}`
      }, (payload) => {
        // Fetch the sender information for the new message
        const fetchMessageWithSender = async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', payload.new.sender_id)
            .single();
          
          if (!error && data) {
            const newMessage = {
              ...payload.new,
              sender: data
            };
            
            setMessages(prev => [...prev, newMessage]);
            setTimeout(scrollToBottom, 100);
          }
        };
        
        fetchMessageWithSender();
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [caseId, user?.id, toast]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Send a new message
  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id || !caseId) return;
    
    setSending(true);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: message.trim(),
          sender_id: user.id,
          case_id: caseId
        });
      
      if (error) throw error;
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };
  
  // Handle key press (Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatSenderName = (sender: any) => {
    if (sender?.first_name && sender?.last_name) {
      return `${sender.first_name} ${sender.last_name}`;
    }
    return sender?.email || 'Unknown';
  };
  
  const getInitials = (sender: any) => {
    if (sender?.first_name && sender?.last_name) {
      return `${sender.first_name[0]}${sender.last_name[0]}`;
    }
    return sender?.email?.[0] || 'U';
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {recipientName ? (
              <>
                <span className="text-sm font-normal text-gray-500">Conversation with</span>
                <span>{recipientName}</span>
              </>
            ) : (
              <>Case Conversation</>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500 text-center p-4">
              <div>
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation by sending a message below</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.sender_id === user?.id;
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-3 max-w-[85%] ${isCurrentUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${formatSenderName(msg.sender)}`} />
                    <AvatarFallback>{getInitials(msg.sender)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div 
                      className={`rounded-lg px-4 py-2 text-sm ${
                        isCurrentUser 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {formatSenderName(msg.sender)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t mt-auto">
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || sending}
              className="h-auto"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
