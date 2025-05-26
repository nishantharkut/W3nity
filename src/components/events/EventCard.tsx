
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Event } from '@/hooks/useEvents';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getEventTypeColor = (type: string) => {
    const colors = {
      workshop: 'bg-blue-100 text-blue-800',
      networking: 'bg-green-100 text-green-800',
      conference: 'bg-purple-100 text-purple-800',
      hackathon: 'bg-orange-100 text-orange-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          <Badge className={getEventTypeColor(event.type)}>
            {event.type}
          </Badge>
        </div>
        <div className="text-sm text-gray-500">
          {new Date(event.date).toLocaleDateString()} at {event.time}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">📍 {event.location}</span>
            <span className="text-sm text-gray-500">By {event.organizer}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {event.attendees}/{event.maxAttendees} attendees
            </span>
            <span className="text-xl font-bold text-green-600">
              ${event.price}
            </span>
          </div>
        </div>
        <Button asChild className="w-full">
          <Link to={`/events/${event.id}`}>Register Now</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
