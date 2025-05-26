
import { useState, useEffect } from 'react';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'networking' | 'conference' | 'hackathon';
  attendees: number;
  maxAttendees: number;
  price: number;
  organizer: string;
  image?: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: integrate API
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Mock data for now
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Web3 Development Workshop',
            description: 'Learn how to build decentralized applications',
            date: '2024-02-20',
            time: '14:00',
            location: 'Tech Hub, Downtown',
            type: 'workshop',
            attendees: 45,
            maxAttendees: 50,
            price: 99,
            organizer: 'BlockchainEdu'
          },
          {
            id: '2',
            title: 'AI & Machine Learning Conference',
            description: 'Latest trends in artificial intelligence',
            date: '2024-03-15',
            time: '09:00',
            location: 'Convention Center',
            type: 'conference',
            attendees: 320,
            maxAttendees: 500,
            price: 299,
            organizer: 'AI Society'
          }
        ];
        setEvents(mockEvents);
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const createEvent = async (eventData: Omit<Event, 'id' | 'attendees'>) => {
    // TODO: integrate API
    console.log('Creating event:', eventData);
  };

  const registerForEvent = async (eventId: string) => {
    // TODO: integrate API
    console.log('Registering for event:', eventId);
  };

  return {
    events,
    loading,
    error,
    createEvent,
    registerForEvent
  };
};
