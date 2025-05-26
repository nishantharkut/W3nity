
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import EventCard from '@/components/events/EventCard';
import { useEvents } from '@/hooks/useEvents';

const Events = () => {
  const { events, loading, error } = useEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tech Events</h1>
          <p className="text-gray-600">Discover workshops, conferences, and networking events</p>
        </div>
        <Button asChild>
          <Link to="/events/create">Create Event</Link>
        </Button>
      </div>

      {/* Event Categories */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="text-lg font-semibold mb-4">Event Categories</h3>
        <div className="flex flex-wrap gap-2">
          {['Workshop', 'Conference', 'Networking', 'Hackathon'].map((category) => (
            <Button key={category} variant="outline" size="sm">
              {category}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
