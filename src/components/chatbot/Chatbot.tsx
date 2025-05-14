
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! I am your ODR assistant. How can I help you today?',
    sender: 'bot',
    timestamp: new Date(),
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateBotResponse = (userMessage: string): Promise<string> => {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple response mapping
        const responseMap: Record<string, string> = {
          hello: 'Hello! How can I assist you with your case today?',
          hi: 'Hi there! How can I help you with your dispute resolution?',
          help: 'I can help with many things including: explaining the mediation process, providing updates on your case, or connecting you with a mediator.',
          case: 'I can help you check the status of your case or explain the next steps in your dispute resolution process.',
          document: 'You can upload documents for your case through the dashboard. Would you like me to guide you through that process?',
          hearing: 'Your upcoming hearings are shown on your dashboard. I can help you prepare for them if needed.',
          mediator: 'Your assigned mediator will be shown in your case details. Would you like more information about working with mediators?',
        };

        // Check for matches in the responseMap
        const lowerCaseMessage = userMessage.toLowerCase();
        let response = 'I\'m not sure how to respond to that. Would you like to ask about your case, documents, hearings, or mediation process?';
        
        // Check if any keyword from the map is in the message
        for (const [keyword, reply] of Object.entries(responseMap)) {
          if (lowerCaseMessage.includes(keyword)) {
            response = reply;
            break;
          }
        }

        resolve(response);
      }, 1000);
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Set typing indicator
    setIsTyping(true);
    
    // Generate bot response
    try {
      const botResponseText = await generateBotResponse(inputMessage);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-orrr-blue-500 hover:bg-orrr-blue-600"
        aria-label="Open chatbot"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* Chatbot panel */}
      <div className={cn(
        "fixed bottom-0 right-0 w-full sm:w-96 h-[600px] max-h-[80vh] bg-white rounded-t-lg shadow-xl z-50 flex flex-col transition-transform duration-300",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between bg-orrr-blue-500 text-white px-4 py-3 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h3 className="font-medium">ODR Assistant</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-orrr-blue-600 rounded-full h-8 w-8 p-0"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={cn(
                "flex items-start gap-3 max-w-[80%]",
                message.sender === 'user' ? "ml-auto" : ""
              )}
            >
              {message.sender === 'bot' && (
                <Avatar className="h-8 w-8 bg-orrr-blue-100">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-orrr-blue-100 text-orrr-blue-500">BOT</AvatarFallback>
                </Avatar>
              )}
              
              <div 
                className={cn(
                  "rounded-lg px-4 py-2 text-sm",
                  message.sender === 'user' 
                    ? "bg-orrr-blue-500 text-white" 
                    : "bg-gray-100 text-gray-800"
                )}
              >
                {message.content}
              </div>
              
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email || 'User'}`} />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 bg-orrr-blue-100">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-orrr-blue-100 text-orrr-blue-500">BOT</AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="h-auto"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
