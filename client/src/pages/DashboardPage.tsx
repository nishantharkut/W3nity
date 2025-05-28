import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle , CardDescription} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuthState } from "@/hooks/useAuth";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Star,
  Activity,
  Bell,
  Plus,
  ArrowRight,
  MessageSquare,
  Award,
  Target,
  Eye,
  CheckCircle
} from "lucide-react";

// interface Project {
//   id: string;
//   title: string;
//   description: string;
//   technologies: string[];
//   status: string;
//   client: string;
//   budget: string;
//   progress: number;
// }


const DashboardPage = () => {

const { user, isAuthenticated } = useAuthState();
console.log(user)
const navigate = useNavigate();
const { toast } = useToast();

const [completedProjects, setCompletedProjects] = useState(12);
const [totalEarnings, setTotalEarnings] = useState(15420);
// const [portfolioProjects, setPortfolioProjects] = useState<Project[]>([]);
const [activeProjects, setActiveProjects] = useState([]);
const [upcomingEvents, setUpcomingEvents] = useState([]);


useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const eventsRes = await fetch("http://localhost:8080/api/events");
      
      const eventsData = await eventsRes.json();

    
      setUpcomingEvents(eventsData);


      console.log("Fetched Events:", eventsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  if (user?._id) {
    fetchDashboardData();
  }
}, [user]);

// ✅ Welcome Toast – Always runs once on mount
useEffect(() => {
  toast({
    title: "Welcome to W3nity!",
    description: "Your collaboration dashboard is ready",
  });
}, [toast]);

// ✅ Stats and Data (declared outside render logic)
const quickStats = [
  {
    title: 'Active Projects',
    value: activeProjects,
    icon: Briefcase,
    change: '+2 this week',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Total Earnings',
    value: `$${totalEarnings.toLocaleString()}`,
    icon: DollarSign,
    change: '+$2,400 this month',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Completed',
    value: completedProjects,
    icon: CheckCircle,
    change: '98% success rate',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'Network',
    value: '847',
    icon: Users,
    change: '+23 connections',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
];

const recentActivities = [
  { action: 'New proposal received', project: 'React Dashboard', time: '2 hours ago', status: 'pending' },
  { action: 'Project completed', project: 'Mobile App UI', time: '1 day ago', status: 'completed' },
  { action: 'Event registered', project: 'Tech Meetup 2024', time: '2 days ago', status: 'upcoming' },
  { action: 'Community post liked', project: 'Web3 Discussion', time: '3 days ago', status: 'active' },
];

// ✅ Handler Functions — also declared at top level
const handleCreateGig = () => {
  navigate('/freelance/create');
  toast({ title: "Create New Gig", description: "Starting gig creation process" });
};

const handleCreateEvent = () => {
  navigate('/events/create');
  toast({ title: "Create New Event", description: "Starting event creation process" });
};

const handleViewGigs = () => {
  navigate('/freelance');
  toast({ title: "Browse Gigs", description: "Exploring available freelance opportunities" });
};

const handleViewEvents = () => {
  navigate('/events');
  toast({ title: "Browse Events", description: "Discovering upcoming tech events" });
};

const handleJoinCommunity = () => {
  navigate('/community');
  toast({ title: "Join Community", description: "Connecting with fellow developers" });
};

const handleViewProfile = () => {
  navigate('/profile');
  toast({ title: "View Profile", description: "Managing your professional profile" });
};

const handleStartChat = () => {
  navigate('/community');
  toast({ title: "Start Chatting", description: "Opening real-time collaboration chat" });
};

const handleViewNotifications = () => {
  navigate('/notifications');
  toast({ title: "Notifications", description: "Checking your latest updates" });
};

if (!isAuthenticated || !user) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">Please Log In</h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to access your dashboard.
          </p>
          <Button asChild className="w-full">
            <Link to="/login">Log In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

return (
  <div className="space-y-8">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome back! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to spark some collaboration today?
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleCreateGig} className="glow-button">
          <Plus className="w-4 h-4 mr-2" />
          Create Gig
        </Button>
        <Button onClick={handleCreateEvent} variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>
    </div>

    {/* Wallet Connection */}
    

    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {quickStats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewProfile}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Quick Actions */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleViewGigs} variant="outline" className="h-20 flex-col hover:bg-primary/5">
              <Briefcase className="w-6 h-6 mb-2" />
              Browse Gigs
            </Button>
            <Button onClick={handleViewEvents} variant="outline" className="h-20 flex-col hover:bg-primary/5">
              <Calendar className="w-6 h-6 mb-2" />
              Find Events
            </Button>
            <Button onClick={handleJoinCommunity} variant="outline" className="h-20 flex-col hover:bg-primary/5">
              <Users className="w-6 h-6 mb-2" />
              Join Community
            </Button>
            <Button onClick={handleStartChat} variant="outline" className="h-20 flex-col hover:bg-primary/5">
              <MessageSquare className="w-6 h-6 mb-2" />
              Start Chat
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </div>
              <Button onClick={handleViewNotifications} variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer" onClick={handleViewNotifications}>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.project}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={activity.status === 'completed' ? 'default' : activity.status === 'pending' ? 'secondary' : 'outline'}>
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        {/* Performance Overview */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Project Success Rate</span>
                <span>98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Client Satisfaction</span>
                <span>4.9/5</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Response Time</span>
                <span>&lt; 2hrs</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            
            <Button onClick={handleViewProfile} variant="outline" className="w-full mt-4">
              <Star className="w-4 h-4 mr-2" />
              View Full Profile
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming
              </div>
              <Button onClick={handleViewEvents} variant="outline" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={handleViewEvents}>
              <h4 className="font-medium">Tech Meetup 2024</h4>
              <p className="text-sm text-muted-foreground">Tomorrow, 6:00 PM</p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={handleViewEvents}>
              <h4 className="font-medium">Web3 Workshop</h4>
              <p className="text-sm text-muted-foreground">Dec 25, 2:00 PM</p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={handleViewEvents}>
              <h4 className="font-medium">React Conference</h4>
              <p className="text-sm text-muted-foreground">Jan 15, 9:00 AM</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
};

export default DashboardPage;



