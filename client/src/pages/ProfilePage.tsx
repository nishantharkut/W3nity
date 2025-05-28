import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Star,
  Calendar,
  Globe,
  Github,
  Linkedin,
  Edit,
  Save,
  X,
  Plus,
  DollarSign,
  Briefcase,
  Users,
  Award,
} from "lucide-react";
import { useAuthState } from "@/hooks/useAuth";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuthState();
  console.log(user);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const [editData, setEditData] = useState<any>({
    username: "",
    fullName: "",
    bio: "",
    location: "",
    hourlyRate: 0,
    portfolioUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    skills: [],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/users/${user._id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile({
            ...data,
            joinedAt: new Date(data.joinedAt),
          });
          setEditData({
            username: data.username || "",
            fullName: data.fullName || "",
            bio: data.bio || "",
            location: data.location || "",
            hourlyRate: data.hourlyRate || 0,
            portfolioUrl: data.portfolioUrl || "",
            githubUrl: data.githubUrl || "",
            linkedinUrl: data.linkedinUrl || "",
            websiteUrl: data.websiteUrl || "",
            skills: data.skills || [],
          });
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile({
          ...updatedProfile,
          joinedAt: new Date(updatedProfile.joinedAt),
        });
        setIsEditing(false);
      } else {
        console.error("Update failed with status:", res.status);
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user || !profile) {
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

  const handleCancel = () => {
    setEditData({
      username: profile?.username || "",
      fullName: profile?.fullName || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      hourlyRate: profile?.hourlyRate || 0,
      portfolioUrl: profile?.portfolioUrl || "",
      githubUrl: profile?.githubUrl || "",
      linkedinUrl: profile?.linkedinUrl || "",
      websiteUrl: profile?.websiteUrl || "",
      skills: profile?.skills || [],
    });
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !editData.skills.includes(newSkill.trim())) {
      setEditData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={profile?.avatar_url || undefined}
                alt={editData.username}
              />
              <AvatarFallback className="text-2xl">
                {profile?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{profile.username}</h1>
                {profile.isVerified && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-gray-600 mb-3">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{profile.rating}</span>
                  <span>({profile.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined{" "}
                    {profile.joinedAt.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                {profile.bio || "No bio available"}
              </p>

              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={editData.username}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={editData.fullName}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editData.location}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={editData.hourlyRate}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        hourlyRate: parseFloat(e.target.value) || 0,
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editData.bio}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    {isEditing && (
                      <button onClick={() => removeSkill(skill)}>
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button onClick={addSkill} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="portfolioUrl">Portfolio</Label>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <Input
                    id="portfolioUrl"
                    value={editData.portfolioUrl}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        portfolioUrl: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="githubUrl">GitHub</Label>
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-gray-500" />
                  <Input
                    id="githubUrl"
                    value={editData.githubUrl}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        githubUrl: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="linkedinUrl">LinkedIn</Label>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-gray-500" />
                  <Input
                    id="linkedinUrl"
                    value={editData.linkedinUrl}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        linkedinUrl: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website</Label>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <Input
                    id="websiteUrl"
                    value={editData.websiteUrl}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        websiteUrl: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">{profile.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reviews</span>
                <span className="font-semibold">{profile.reviewCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Projects</span>
                <span className="font-semibold">15</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Response Rate</span>
                <span className="font-semibold">96%</span>
              </div>
            </CardContent>
          </Card>

          {/* Web3 Wallet */}
          <Card>
            <CardHeader>
              <CardTitle>Web3 Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">Connected Wallet</div>
                <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {profile.walletAddress}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  View Earnings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                View My Gigs
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Users className="w-4 h-4 mr-2" />
                My Network
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Star className="w-4 h-4 mr-2" />
                Reviews
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
