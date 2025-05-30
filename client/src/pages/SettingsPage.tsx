import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Bell, Shield, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuth";
const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthState();
  console.log(user);

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    location: "",
    skills: [],
    socialLinks: [],
    isClient: false,
    bio: "",
    companyName: "",
    reviewCount: 0,
    rating:0,
  });

  // Fetch user profile on mount
  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/${user._id}`)
      .then((res) => {
        setProfileData({
          username: res.data.username || "",
          email: res.data.email || "",
          location: res.data.location || "",
          skills: res.data.skills || [],
          socialLinks: res.data.socialLinks || [],
          isClient: res.data.isClient || false,
          bio: res.data.bio || "",
          companyName: res.data.companyName || "",
          reviewCount: res.data.reviewCount || 0,
          rating: res.data.rating || 0,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error loading profile",
          description: "Failed to load user profile.",
          variant: "destructive",
        });
      });
  }, [user]);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    proposalAlerts: true,
    messageAlerts: true,
    eventReminders: true,
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showEmail: false,
    showLocation: true,
    allowDirectMessages: true,
  });

  const handleSaveProfile = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}`,
        profileData
      );
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: "Could not save profile. Try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSavePrivacy = () => {
    toast({
      title: "Privacy Settings Updated",
      description: "Your privacy settings have been updated.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Are you a Client?</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Toggle to indicate if you are hiring or looking for talent.
            </p>
          </div>
          <Switch
            checked={profileData.isClient}
            onCheckedChange={(checked) =>
              setProfileData((prev) => ({
                ...prev,
                isClient: checked,
              }))
            }
          />
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 glass-effect">
            <TabsTrigger
              value="profile"
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center space-x-2"
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex items-center space-x-2"
            >
              <Palette className="w-4 h-4" />
              <span>Appearance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Username
                    </label>
                    <Input
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                </div> */}
                <Textarea
                  placeholder="Skills (comma-separated)"
                  value={profileData.skills.join(", ")}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      skills: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                />

                <Textarea
                  placeholder="Social Links (comma-separated)"
                  value={profileData.socialLinks.join(", ")}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      socialLinks: e.target.value
                        .split(",")
                        .map((link) => link.trim()),
                    })
                  }
                />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <Input
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>
                {profileData.isClient && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Bio
                      </label>
                      <Textarea
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Company Name
                      </label>
                      <Input
                        value={profileData.companyName}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            companyName: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Review Count
                      </label>
                      <Input
                        type="number"
                        value={profileData.reviewCount}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            reviewCount: parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Client Rating
                      </label>
                      <Input
                        type="number"
                        value={profileData.rating}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            rating: parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>

                    
                  </>
                )}

                <Button onClick={handleSaveProfile} className="glow-button">
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        emailNotifications: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        pushNotifications: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Proposal Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new proposals
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.proposalAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        proposalAlerts: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Message Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new messages
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.messageAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        messageAlerts: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Event Reminders</h4>
                    <p className="text-sm text-muted-foreground">
                      Get reminders about upcoming events
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.eventReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        eventReminders: checked,
                      }))
                    }
                  />
                </div>

                <Button
                  onClick={handleSaveNotifications}
                  className="glow-button"
                >
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Profile Visibility</h4>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to other users
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.profileVisible}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        profileVisible: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show Email</h4>
                    <p className="text-sm text-muted-foreground">
                      Display your email address on your profile
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showEmail}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        showEmail: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show Location</h4>
                    <p className="text-sm text-muted-foreground">
                      Display your location on your profile
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showLocation}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        showLocation: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Allow Direct Messages</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow other users to send you direct messages
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.allowDirectMessages}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        allowDirectMessages: checked,
                      }))
                    }
                  />
                </div>

                <Button onClick={handleSavePrivacy} className="glow-button">
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <Palette className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    Theme customization coming soon
                  </h3>
                  <p className="text-muted-foreground">
                    We're working on adding theme options and customization
                    features.
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

export default SettingsPage;
