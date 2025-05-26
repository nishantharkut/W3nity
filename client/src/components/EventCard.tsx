
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Event } from '@/types';
import { Calendar, MapPin, Users, DollarSign, Clock } from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';

interface EventCardProps {
  event: Event;
  onViewDetails?: (eventId : string) => void;
  onRegister?: (eventId: string) => void;
}

const EventCard = ({ event, onViewDetails, onRegister }: EventCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'conference':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'workshop':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'networking':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'hackathon':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'webinar':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'live':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getLocationIcon = () => {
    switch (event.location.type) {
      case 'online':
        return '🌐';
      case 'physical':
        return '📍';
      case 'hybrid':
        return '🔄';
      default:
        return '📍';
    }
  };

  const isUpcoming = isBefore(new Date(), event.startDate);
  const isLive = isAfter(new Date(), event.startDate) && isBefore(new Date(), event.endDate);
  const isSoldOut = event.maxAttendees && event.currentAttendees >= event.maxAttendees;
  const isEndingSoon = isAfter(addDays(new Date(), 3), event.startDate);

  return (
    <Card className="glass-effect card-hover h-full">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex space-x-2">
            <Badge className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
            <Badge className={getStatusColor(event.status)}>
              {event.status}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              {format(event.startDate, 'MMM dd')}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(event.startDate, 'yyyy')}
            </div>
          </div>
        </div>

        <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
        <p className="text-muted-foreground line-clamp-3">{event.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Image Placeholder */}
        {event.image ? (
          <div className="aspect-video rounded-lg overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video rounded-lg bg-gradient-spark flex items-center justify-center">
            <Calendar className="w-12 h-12 text-white/70" />
          </div>
        )}

        {/* Event Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{format(event.startDate, 'EEEE, MMMM do, yyyy')}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>
              {format(event.startDate, 'h:mm a')} - {format(event.endDate, 'h:mm a')}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <span className="text-lg">{getLocationIcon()}</span>
            <span className="line-clamp-1">
              {event.location.type === 'online' 
                ? 'Online Event' 
                : event.location.address || 'TBA'
              }
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{event.currentAttendees} attending</span>
              {event.maxAttendees && (
                <span className="text-muted-foreground">
                  / {event.maxAttendees} max
                </span>
              )}
            </div>
            
            {event.price > 0 && (
              <div className="flex items-center space-x-1 text-lg font-bold text-gradient">
                <DollarSign className="w-4 h-4" />
                <span>{event.price}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {event.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {event.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{event.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Organizer */}
        <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src={event?.organizer?.avatar} alt={event?.organizer?.username} />
            <AvatarFallback className="text-xs">
              {event?.organizer?.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm font-medium">{event?.organizer?.username}</div>
            <div className="text-xs text-muted-foreground">Organizer</div>
          </div>
        </div>

        {/* Warning Messages */}
        {isEndingSoon && isUpcoming && (
          <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="text-xs text-orange-400 font-medium">
              ⚡ Registration ends soon!
            </div>
          </div>
        )}

        {isSoldOut && (
          <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="text-xs text-red-400 font-medium">
              🎫 Event is sold out
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewDetails?.(event._id)}
          >
            View Details
          </Button>
          {isUpcoming && !isSoldOut && (
            <Button 
              className="flex-1 glow-button"
              onClick={() => onRegister?.(event._id)}
            >
              {event.price > 0 ? 'Buy Ticket' : 'Register Free'}
            </Button>
          )}
          {isLive && (
            <Button className="flex-1 glow-button">
              Join Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
