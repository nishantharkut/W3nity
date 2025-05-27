
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bell, Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'proposal' | 'message' | 'payment' | 'system';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Proposal Received',
    content: 'You received a new proposal for your DeFi Dashboard project',
    type: 'proposal',
    isRead: false,
    createdAt: new Date(),
    actionUrl: '/gig/1'
  },
  {
    id: '2',
    title: 'Message from sarah_designer',
    content: 'Hey! I have some questions about the UI/UX requirements...',
    type: 'message',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: '3',
    title: 'Payment Received',
    content: 'You received $2,500 for completing the React project',
    type: 'payment',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: '4',
    title: 'System Update',
    content: 'New features have been added to your dashboard',
    type: 'system',
    isRead: true,
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  }
];

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'proposal': return 'bg-blue-500';
      case 'message': return 'bg-green-500';
      case 'payment': return 'bg-yellow-500';
      case 'system': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-muted-foreground">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="glass-effect">
              <CardContent className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`glass-effect transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-3 h-3 rounded-full mt-2 ${getTypeColor(notification.type)}`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                          <Badge variant="outline" className="text-xs capitalize">
                            {notification.type}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {notification.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(notification.createdAt, 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {notification.actionUrl && (
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(notification.actionUrl!)}
                      >
                        View Details
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;