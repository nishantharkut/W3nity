
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuth';
const CreateEventPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locationType, setLocationType] = useState('');
  const [location, setLocation] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [price, setPrice] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
 const {user, isAuthenticated}= useAuthState()
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const eventData = {
    title,
    description,
    category,
    startDate,
    endDate,
    location: { type: locationType, address: location },
    maxAttendees: Number(maxAttendees),
    price: Number(price),
    isOnline,
    tags,
    organizer: user._id,
  };

  try {
    const response = await fetch('http://localhost:8080/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    const text = await response.text(); 

    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      // If server sent error info, use it; else generic error
      throw new Error(data?.error || 'Failed to create event');
    }

    console.log('Event created:', data);
    navigate('/events');
  } catch (error: any) {
    alert(`Error: ${error.message}`);
  }
};



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

      <Card className="max-w-3xl mx-auto glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Event Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Web3 Developer Conference 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your event..."
                rows={4}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location Type</label>
                <Select value={locationType} onValueChange={setLocationType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date & Time</label>
                <Input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date & Time</label>
                <Input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location/Address</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={locationType === 'online' ? 'Zoom/Teams link' : 'Event venue address'}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Max Attendees</label>
                <Input
                  type="number"
                  value={maxAttendees}
                  onChange={(e) => setMaxAttendees(e.target.value)}
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price ($)</label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0 for free events"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer">
                    {tag}
                    <X 
                      className="w-3 h-3 ml-1" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="glow-button">
                Create Event
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/events')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEventPage;
