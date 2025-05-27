import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuthState } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
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
} from "lucide-react";

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuthState();
  console.log(user)
  const [activeProjects, setActiveProjects] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, eventsRes] = await Promise.all([
          fetch(`http://localhost:8080/api/projects/${user._id}`),
          fetch("http://localhost:8080/api/events"),
        ]);

        const projectsData = await projectsRes.json();
        const eventsData = await eventsRes.json();

        setActiveProjects(projectsData);
        console.log(activeProjects);
        setUpcomingEvents(eventsData);
        console.log(upcomingEvents);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [user]);

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

  const quickStats = [
    {
      title: "Active Projects",
      value: "3",
      change: "+2 this week",
      icon: Briefcase,
      color: "text-blue-500",
    },
    {
      title: "This Month Earnings",
      value: "$4,250",
      change: "+12% from last month",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Pending Proposals",
      value: "7",
      change: "2 responses needed",
      icon: MessageSquare,
      color: "text-yellow-500",
    },
    {
      title: "Client Rating",
      value: "4.9",
      change: "Based on 24 reviews",
      icon: Star,
      color: "text-purple-500",
    },
  ];

  // const activeProjects = [
  //   {
  //     id: '1',
  //     title: 'E-commerce Platform Redesign',
  //     client: 'TechCorp',
  //     deadline: '2024-12-30',
  //     progress: 75,
  //     budget: '$5,000',
  //     status: 'In Progress'
  //   },
  //   {
  //     id: '2',
  //     title: 'Mobile App Development',
  //     client: 'StartupXYZ',
  //     deadline: '2025-01-15',
  //     progress: 45,
  //     budget: '$8,500',
  //     status: 'In Progress'
  //   },
  //   {
  //     id: '3',
  //     title: 'API Integration',
  //     client: 'DataFlow Inc',
  //     deadline: '2024-12-25',
  //     progress: 90,
  //     budget: '$2,200',
  //     status: 'Review'
  //   }
  // ];

  const recentActivity = [
    {
      id: "1",
      type: "proposal",
      title: "New proposal submitted",
      description: "Web3 Dashboard Development - $6,000",
      time: "2 hours ago",
      icon: MessageSquare,
    },
    {
      id: "2",
      type: "payment",
      title: "Payment received",
      description: "$2,500 from TechCorp",
      time: "1 day ago",
      icon: DollarSign,
    },
    {
      id: "3",
      type: "message",
      title: "New message from client",
      description: 'StartupXYZ: "Great progress on the mobile app!"',
      time: "2 days ago",
      icon: MessageSquare,
    },
    {
      id: "4",
      type: "milestone",
      title: "Project milestone completed",
      description: "API Integration - Phase 2",
      time: "3 days ago",
      icon: Target,
    },
  ];

  // const upcomingEvents = [
  //   {
  //     id: '1',
  //     title: 'Project Review Call',
  //     client: 'TechCorp',
  //     date: '2024-12-28',
  //     time: '2:00 PM',
  //     type: 'meeting'
  //   },
  //   {
  //     id: '2',
  //     title: 'Deadline: Mobile App MVP',
  //     client: 'StartupXYZ',
  //     date: '2024-12-30',
  //     time: 'End of day',
  //     type: 'deadline'
  //   },
  //   {
  //     id: '3',
  //     title: 'Web3 Conference',
  //     client: 'Industry Event',
  //     date: '2025-01-05',
  //     time: '9:00 AM',
  //     type: 'event'
  //   }
  // ];

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.username}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your freelance business today.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button className="glow-button">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass-effect card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gradient">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Dashboard Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Active Projects */}
              <Card className="glass-effect">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Active Projects
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard?tab=projects">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeProjects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold line-clamp-1">
                          {project.title}
                        </h4>
                        <Badge
                          variant={
                            project.status === "In Progress"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Client: {project.client} • Due:{" "}
                        {new Date(project.deadline).toLocaleDateString()}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} />
                      </div>
                      <div className="text-right text-sm font-medium text-gradient">
                        {project.budget}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">
                            {activity.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events */}
            <Card className="glass-effect">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Calendar className="w-5 h-5" />
      Upcoming Events
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid md:grid-cols-3 gap-4">
      {upcomingEvents.map((event) => (
        <div key={event._id} className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              event.category === 'deadline' ? 'bg-red-500' :
              event.category === 'meeting' ? 'bg-blue-500' : 'bg-green-500'
            }`} />
            <span className="text-sm font-medium">{event.title}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-1">
            {new Date(event.startDate).toLocaleDateString()}
          </p>
          <p className="text-xs text-muted-foreground mb-1">
            {event.isOnline ? 'Online Event' : event.location?.address || 'Location TBA'}
          </p>
          <p className="text-xs text-muted-foreground">
            Tags: {event.tags?.join(', ')}
          </p>
        </div>
      ))}
    </div>
  </CardContent>
</Card>

          </TabsContent>

          <TabsContent value="projects">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border rounded-lg p-6 space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground">
                            Client: {project.client}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={
                              project.status === "In Progress"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {project.status}
                          </Badge>
                          <span className="font-semibold text-gradient">
                            {project.budget}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress ({project.progress}%)</span>
                          <span>
                            Due:{" "}
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <Progress value={project.progress} />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">View Details</Button>
                        <Button size="sm" variant="outline">
                          Message Client
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proposals">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Submitted Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Proposals Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start browsing projects and submit your first proposal.
                  </p>
                  <Button asChild className="glow-button">
                    <Link to="/freelance">Browse Projects</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    Analytics Coming Soon
                  </h3>
                  <p className="text-muted-foreground">
                    Detailed analytics and insights will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
