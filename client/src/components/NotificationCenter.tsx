
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Check, 
  X, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  User,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { socket } from '@/socket';
import { useAuthState } from '@/hooks/useAuth';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'gig' | 'event' | 'message' | 'system';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      _id: '1',
      title: 'New Gig Proposal',
      message: 'You received a proposal for your React development project',
      type: 'info',
      category: 'gig',
      isRead: false,
      createdAt: '2024-01-15T10:30:00Z',
      actionUrl: '/gig/1'
    },
    {
      _id: '2',
      title: 'Event Reminder',
      message: 'Tech meetup starts in 1 hour',
      type: 'warning',
      category: 'event',
      isRead: false,
      createdAt: '2024-01-15T09:00:00Z',
      actionUrl: '/event/1'
    },
    {
      _id: '3',
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated',
      type: 'success',
      category: 'system',
      isRead: true,
      createdAt: '2024-01-14T16:45:00Z'
    }
  ]);

  const { toast } = useToast();
  const { isAuthenticated, user } = useAuthState();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    const ctx = new (window.AudioContext || window.AudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.value = 0.1;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.15);
    setTimeout(() => ctx.close(), 200);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated || !user?._id) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('sparkverse-auth') ? JSON.parse(localStorage.getItem('sparkverse-auth')).token : ''}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        // handle error
      }
    };
    fetchNotifications();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      if (document.hasFocus()) playNotificationSound();
    };
    socket.on('notification', handleNotification);
    return () => {
      socket.off('notification', handleNotification);
    };
  }, [soundEnabled]);

  const getNotificationIcon = (category: string) => {
    switch (category) {
      case 'gig': return <Briefcase className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'system': return <User className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <X className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif._id === id ? { ...notif, isRead: true } : notif
      )
    );
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/mark-read/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('sparkverse-auth') ? JSON.parse(localStorage.getItem('sparkverse-auth')).token : ''}` }
      });
    } catch (err) {}
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/mark-all-read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('sparkverse-auth') ? JSON.parse(localStorage.getItem('sparkverse-auth')).token : ''}` }
      });
      toast({
        title: "All notifications marked as read",
        description: "Your notification center has been updated.",
      });
    } catch (err) {}
  };

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(notif => notif._id !== id));
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('sparkverse-auth') ? JSON.parse(localStorage.getItem('sparkverse-auth')).token : ''}` }
      });
    } catch (err) {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const groupedNotifications = notifications.reduce((acc, notif) => {
    const group = notif.type || 'other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {} as Record<string, Notification[]>);

  const groupLabels: Record<string, string> = {
    gig: 'Gigs',
    event: 'Events',
    message: 'Messages',
    system: 'System',
  };

  if (!isOpen) return null;

  return (
    <Card className="absolute top-16 right-4 w-96 max-h-96 z-50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant={soundEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setSoundEnabled(v => !v)}
            className="text-xs"
          >
            {soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          {Object.keys(groupedNotifications).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            Object.entries(groupedNotifications).map(([group, notifs]) => (
              <div key={group} className="mb-2">
                <div className="font-semibold text-xs text-gray-500 uppercase px-3 py-1">
                  {groupLabels[group] || group}
                </div>
                <div className="space-y-1">
                  {notifs.map((notification, index) => (
                    <React.Fragment key={notification._id}>
                      <div
                        className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => markAsRead(notification._id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              {getTypeIcon(notification.type)}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation();
                                deleteNotification(notification._id);
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation();
                                markAsRead(notification._id);
                              }}
                              className="h-6 w-6 p-0"
                              disabled={notification.isRead}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < notifs.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;