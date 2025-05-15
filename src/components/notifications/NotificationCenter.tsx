
import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import NotificationItem, { NotificationType } from './NotificationItem';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fetch notifications when component mounts and when user changes
  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('recipient_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (error) throw error;
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: 'Error',
          description: 'Could not load notifications',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}` 
        }, 
        (payload) => {
          // Add the new notification to the top of the list
          setNotifications(prev => [payload.new as NotificationType, ...prev]);
          
          // Show a toast for the new notification
          toast({
            title: (payload.new as NotificationType).title,
            description: (payload.new as NotificationType).content,
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, toast]);
  
  const handleMarkRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const handleMarkAllRead = async () => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Could not mark notifications as read',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div className="relative" ref={notificationRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="text-sm font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 hover:bg-transparent hover:underline"
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
          
          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="mx-auto h-8 w-8 opacity-40 mb-2" />
                <p>You have no notifications</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id} 
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    onClose={() => setIsOpen(false)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
