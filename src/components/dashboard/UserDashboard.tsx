
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useWeb3 } from '@/contexts/Web3Context';
import { 
  Briefcase, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

const UserDashboard = () => {
  const { account, isConnected } = useWeb3();

  const stats = [
    { label: 'Active Proposals', value: '3', icon: Briefcase, color: 'text-blue-600' },
    { label: 'Events Registered', value: '2', icon: Calendar, color: 'text-green-600' },
    { label: 'Earnings This Month', value: '$2,400', icon: DollarSign, color: 'text-purple-600' },
    { label: 'Profile Views', value: '124', icon: TrendingUp, color: 'text-orange-600' },
  ];

  const recentGigs = [
    { id: '1', title: 'React E-commerce Platform', status: 'in-progress', budget: 5000, client: 'TechCorp Inc.' },
    { id: '2', title: 'Smart Contract Development', status: 'pending', budget: 8000, client: 'CryptoVentures' },
  ];

  const upcomingEvents = [
    { id: '1', title: 'Web3 Development Workshop', date: '2024-02-20', time: '14:00' },
    { id: '2', title: 'AI & Machine Learning Conference', date: '2024-03-15', time: '09:00' },
  ];

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-8">Please connect your wallet to access your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your projects and events</p>
        
        {/* Wallet Info */}
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Wallet Connected</span>
            <Badge variant="outline" className="ml-auto text-xs font-mono">
              {account?.slice(0, 8)}...{account?.slice(-6)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Gigs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Recent Gigs
            </CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link to="/freelance" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Browse More
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGigs.map((gig) => (
                <div key={gig.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm md:text-base">{gig.title}</h4>
                    <p className="text-sm text-gray-600">By {gig.client}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={gig.status === 'in-progress' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {gig.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      </Badge>
                      <span className="text-sm font-semibold text-green-600">
                        ${gig.budget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/freelance/gig/${gig.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link to="/events" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Browse More
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm md:text-base">{event.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/events/${event.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild className="h-20 flex-col">
                <Link to="/freelance/create">
                  <Plus className="h-6 w-6 mb-2" />
                  Post a Gig
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link to="/events/create">
                  <Calendar className="h-6 w-6 mb-2" />
                  Create Event
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link to="/community">
                  <Users className="h-6 w-6 mb-2" />
                  Join Chat
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link to="/profile">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
