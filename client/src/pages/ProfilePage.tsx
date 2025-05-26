import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuthState } from "@/hooks/useAuth";
import EditProfileModal from "@/components/EditProfileModal";
import {
  MapPin,
  Star,
  Briefcase,
  Calendar,
  Award,
  Edit3,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Settings,
  Shield,
  Wallet,
} from "lucide-react";
import { User } from "@/types/index";

import AddProjectModal from "@/components/AddProjectModal";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: string;
  client: string;
  budget: string;
}

const ProfilePage = () => {
  const { user: authUser, isAuthenticated } = useAuthState();

  const [user, setUser] = useState<User | null>(null);
  const [portfolioProjects, setPortfolioProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (user) {
          const res = await fetch(`http://localhost:8080/api/projects`);
          if (res.ok) {
            const data = await res.json();
            setPortfolioProjects(data.projects); // assuming the API returns { projects: [...] }
          } else {
            console.error("Failed to fetch projects");
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [user]);

  // Simulate loading based on authUser presence
  useEffect(() => {
    if (authUser) {
      const fixedUser: User = {
        ...authUser,
        joinedAt: new Date(authUser.joinedAt),
      };
      setUser(fixedUser);
      setIsLoading(false);
    } else if (!authUser && isAuthenticated) {
      setIsLoading(false);
    }
  }, [authUser, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  // If still unauthenticated or user not valid, redirect to login
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">Please Log In</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to view your profile.
            </p>
            <Button asChild className="w-full">
              <a href="/login">Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddProject = (project: Project) => {
    setPortfolioProjects((prev) => [...prev, project]);
  };

  const earnings = {
    thisMonth: 4250,
    lastMonth: 3800,
    total: 47300,
    pendingPayouts: 1200,
  };

  const stats = [
    { label: "Projects Completed", value: "24", icon: Briefcase },
    { label: "Client Rating", value: "4.9", icon: Star },
    { label: "Response Time", value: "2h", icon: Calendar },
    { label: "Success Rate", value: "98%", icon: Award },
  ];

  const handleSave = async (updatedData: typeof user) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${authUser?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      if (res.ok) {
        setUser(updatedData);
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8 glass-effect">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl bg-gradient-spark text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{user?.username}</h1>
                    {user?.isVerified && (
                      <Shield className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{user?.rating}</span>
                      <span className="text-muted-foreground">
                        ({user.reviewCount} reviews)
                      </span>
                    </div>
                    {/* <span className="text-muted-foreground">
                      Member since {user?.createdAt}
                    </span> */}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {user.bio && (
              <p className="mt-4 text-muted-foreground">{user.bio}</p>
            )}

            {/* Skills */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user?.skills?.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats?.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass-effect">
                <CardContent className="pt-6 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Projects</h2>
                {/* <Button className="glow-button">
                  Add New Project
                </Button> */}
                <AddProjectModal onAddProject={handleAddProject} />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioProjects?.map((project) => (
                  <Card key={project.id} className="glass-effect card-hover">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-2">
                          {project.title}
                        </CardTitle>
                        <Badge
                          variant={
                            project?.status === "Completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {project?.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {project?.description}
                      </p>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {project?.technologies?.map((tech) => (
                            <Badge
                              key={tech}
                              variant="outline"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            Client: {project.client}
                          </span>
                          <span className="font-semibold text-gradient">
                            {project.budget}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="earnings">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Earnings Overview</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass-effect">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          This Month
                        </p>
                        <p className="text-2xl font-bold text-gradient">
                          ${earnings.thisMonth.toLocaleString()}
                        </p>
                      </div>
                      <Wallet className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Last Month
                        </p>
                        <p className="text-2xl font-bold">
                          ${earnings.lastMonth.toLocaleString()}
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Earned
                        </p>
                        <p className="text-2xl font-bold">
                          ${earnings.total.toLocaleString()}
                        </p>
                      </div>
                      <Award className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-yellow-500">
                          ${earnings.pendingPayouts.toLocaleString()}
                        </p>
                      </div>
                      <Briefcase className="w-8 h-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle>Earning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Monthly Goal: $5,000</span>
                        <span className="text-sm">
                          {Math.round((earnings.thisMonth / 5000) * 100)}%
                        </span>
                      </div>
                      <Progress value={(earnings.thisMonth / 5000) * 100} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Client Reviews</h2>
              <div className="text-center py-12">
                <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                <p className="text-muted-foreground">
                  Complete your first project to start receiving client reviews.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Account Settings</h2>

              <div className="grid gap-6">
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    {/* {user?.walletAddress && (
                      <div className="flex items-center gap-3">
                        <Wallet className="w-5 h-5 text-muted-foreground" />
                        <span className="font-mono text-sm">{user?.walletAddress}</span>
                      </div>
                    )} */}
                  </CardContent>
                </Card>

                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Privacy Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {isEditing && user && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProfilePage;
