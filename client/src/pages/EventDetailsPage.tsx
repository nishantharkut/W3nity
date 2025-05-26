import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch event by ID
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/events/${id}`); // Adjust the endpoint if needed
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Loading and error states
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button onClick={() => navigate('/events')}>Back to Events</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/events')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(event.startDate), 'EEEE, MMMM do, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge>{event.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {event.image && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-3">About This Event</h3>
                <p className="text-muted-foreground">{event.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {event.location?.type === 'online' 
                      ? 'Online Event' 
                      : event.location?.address || 'TBA'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <Badge>{event.category}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Attendees</span>
                <span className="font-medium">
                  {event.currentAttendees} 
                  {event.maxAttendees && ` / ${event.maxAttendees}`}
                </span>
              </div>
              {event.price > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <div className="flex items-center space-x-1 font-bold text-gradient">
                    <DollarSign className="w-4 h-4" />
                    <span>{event.price}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={event.organizer?.avatar} alt={event.organizer?.username} />
                  <AvatarFallback>{event.organizer?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{event.organizer?.username}</div>
                  <div className="text-sm text-muted-foreground">Event Organizer</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full glow-button">
            {event.price > 0 ? 'Buy Ticket' : 'Register for Free'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
