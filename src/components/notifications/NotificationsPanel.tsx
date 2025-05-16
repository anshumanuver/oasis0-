
import { useState, useEffect } from 'react';
import { useRealTimeNotifications } from '@/hooks/use-notifications';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead } = useRealTimeNotifications();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#notifications-panel') && !target.closest('#notifications-button')) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const togglePanel = () => {
    setOpen(!open);
  };
  
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await markAllAsRead();
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };
  
  return (
    <>
      <Button
        id="notifications-button"
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={togglePanel}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500"
            variant="destructive"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      {open && (
        <div 
          id="notifications-panel"
          className="absolute top-12 right-0 w-80 bg-white rounded-md shadow-lg z-50 border"
        >
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="text-sm font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-6"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="mx-auto h-8 w-8 opacity-40 mb-2" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 border-b text-sm ${!notification.is_read ? 'bg-muted/30' : ''}`}
                >
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs">{notification.content}</p>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 border-t text-center">
              <Button variant="link" size="sm" className="text-xs h-6 mx-auto">
                View all
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
