
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useEvents } from '@/hooks/useEvents';

const FeaturedEvents = () => {
  const { events, loading } = useEvents();

  if (loading) {
    return <div className="text-center py-12">Loading Featured Events...</div>;
  }

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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join exclusive tech events, workshops, and networking sessions with industry leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {events.slice(0, 4).map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
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
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">📍 {event.location}</span>
                  <span className="text-sm text-gray-500">
                    {event.attendees}/{event.maxAttendees} attendees
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-600">
                    ${event.price}
                  </span>
                  <Button size="sm" asChild>
                    <Link to={`/events/${event.id}`}>Register</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
