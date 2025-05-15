
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Bell, FileText, MessageSquare, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NotificationType {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
  related_to_case?: string;
}

interface NotificationItemProps {
  notification: NotificationType;
  onMarkRead: (id: string) => void;
  onClose?: () => void;
}

export default function NotificationItem({ notification, onMarkRead, onClose }: NotificationItemProps) {
  const navigate = useNavigate();
  
  const getIcon = () => {
    if (notification.title.toLowerCase().includes('case')) return <FileText className="h-5 w-5 text-blue-500" />;
    if (notification.title.toLowerCase().includes('message')) return <MessageSquare className="h-5 w-5 text-purple-500" />;
    if (notification.title.toLowerCase().includes('hearing')) return <Calendar className="h-5 w-5 text-green-500" />;
    return <Bell className="h-5 w-5 text-gray-500" />;
  };
  
  const handleClick = () => {
    onMarkRead(notification.id);
    
    if (notification.related_to_case) {
      navigate(`/cases/${notification.related_to_case}`);
    } else if (notification.title.toLowerCase().includes('message')) {
      navigate('/messages');
    }
    
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <div 
      className={cn(
        "p-3 border-b last:border-0 cursor-pointer transition-colors hover:bg-gray-50",
        !notification.is_read && "bg-blue-50"
      )}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "text-sm font-medium mb-1",
            !notification.is_read && "font-semibold"
          )}>
            {notification.title}
          </h4>
          <p className="text-xs text-gray-600 line-clamp-2 mb-1">
            {notification.content}
          </p>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </span>
        </div>
        {!notification.is_read && (
          <div className="ml-2 mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
        )}
      </div>
    </div>
  );
}
