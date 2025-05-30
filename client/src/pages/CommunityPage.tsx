"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Users,
  Globe,
  Lock,
  MessageSquare,
  Hash,
} from "lucide-react";
import { useAuthState } from "@/hooks/useAuth";
import { User } from "@/types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CommunityPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthState();
  // console.log(user)
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("explore");
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    type: "public",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // 🟡 Fetch groups from backend
  const fetchGroups = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/groups`);
      const data = await res.json();
      console.log(data);
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // 🟢 Create group by calling backend
  const handleAddGroup = async () => {
    if (!user?._id) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newGroup,
          members: [{ user }],
        }),
      });

      if (res.ok) {
        const createdGroup = await res.json();
        setGroups((prev) => [...prev, createdGroup]);
        setNewGroup({ name: "", description: "", type: "public" });
        setDialogOpen(false);
      } else {
        console.error("Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/groups/${groupId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user._id }),
        }
      );

      if (res.ok) {
        const updatedGroup = await res.json();
        setGroups((prev) =>
          prev.map((g) => (g?._id === updatedGroup._id ? updatedGroup : g))
        );
        navigate(`/community/${groupId}`);
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGroupIcon = (type: string) => {
    switch (type) {
      case "public":
        return <Globe className="w-4 h-4" />;
      case "private":
        return <Lock className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  const GroupCard = ({ group }: { group: any }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary">
              {getGroupIcon(group.type)}
            </div>
            <div>
              <h3 className="font-semibold">{group.name}</h3>
              <p className="text-xs text-muted-foreground">
                {group.members?.length ?? 0} members
              </p>
            </div>
          </div>
          <Badge variant="outline">{group.type}</Badge>
        </div>
        <p className="text-sm mt-2 text-muted-foreground">
          {group.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex -space-x-2">
          {Array.isArray(group?.members) &&
            group.members
              .slice(0, 5)
              .filter((member) => member) // skip null/undefined members
              .map((member: any) => (
                <Avatar
                  key={member._id || member.id}
                  className="w-8 h-8 border-2 border-background mb-1"
                >
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member?.username}`}
                  />
                  <AvatarFallback className="text-xs">
                    {member?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}

          {group.members.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
              +{group.members.length - 5}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          Last active: {new Date(group.lastActivity).toLocaleDateString()}
        </div>

        {user && (user._id || user.id) ? (
          group.members.some((m: any) => m?._id === (user._id || user.id)) ? (
            <div className="flex gap-2">
              <Button variant="secondary" disabled className="w-full">
                <Users className="w-4 h-4 mr-2" /> Joined
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/community/${group._id}`)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat Now
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                console.log(
                  "Joining group with ID:",
                  group._id,
                  "as user",
                  user._id || user.id
                );
                handleJoinGroup(group._id);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Join Chat
            </Button>
          )
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/login")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Login to Join
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div>
          <h1 className="text-3xl font-bold mb-1">Community</h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connect with others and explore groups
          </motion.p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., React Learners"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your group..."
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="type">Group Type</Label>
                <Select
                  value={newGroup.type}
                  onValueChange={(value) =>
                    setNewGroup({ ...newGroup, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select group type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddGroup} className="w-full">
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Card className="glass-effect">
          <CardContent className="pt-6 text-center">
            <motion.div
              className="text-2xl font-bold text-gradient"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {groups.length}
            </motion.div>
            <div className="text-sm text-muted-foreground">Total Groups</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="pt-6 text-center">
            <motion.div
              className="text-2xl font-bold text-gradient"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {groups.length}
            </motion.div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="pt-6 text-center">
            <motion.div
              className="text-2xl font-bold text-gradient"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              1.2K
            </motion.div>
            <div className="text-sm text-muted-foreground">Messages Today</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="pt-6 text-center">
            <motion.div
              className="text-2xl font-bold text-gradient"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              24
            </motion.div>
            <div className="text-sm text-muted-foreground">Online Now</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <Tabs
          defaultValue="explore"
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="explore">
              <Globe className="w-4 h-4 mr-2" /> Explore
            </TabsTrigger>
            <TabsTrigger value="my-groups">
              <Users className="w-4 h-4 mr-2" /> My Groups
            </TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="explore">
            {filteredGroups.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {filteredGroups.map((group) => (
                  <GroupCard key={group._id} group={group} />
                ))}
              </motion.div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No groups found. Try creating one!
              </p>
            )}
          </TabsContent>

          <TabsContent value="my-groups">
            {user?._id &&
            filteredGroups?.some(
              (g) =>
                Array.isArray(g?.members) &&
                g.members.some((m: any) => {
                  if (!m) return false;
                  if (typeof m === "string") return m === user._id;
                  if (typeof m === "object")
                    return m._id === user._id || m.id === user._id;
                  return false;
                })
            ) ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {filteredGroups
                  ?.filter(
                    (g) =>
                      Array.isArray(g?.members) &&
                      g.members.some((m: any) => {
                        if (!m) return false;
                        if (typeof m === "string") return m === user._id;
                        if (typeof m === "object")
                          return m._id === user._id || m.id === user._id;
                        return false;
                      })
                  )
                  .map((group) => (
                    <GroupCard key={group._id} group={group} />
                  ))}
              </motion.div>
            ) : (
              <motion.p
                className="text-center text-muted-foreground py-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                You're not part of any groups yet.
              </motion.p>
            )}
          </TabsContent>
          <TabsContent value="trending" className="space-y-6">
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold mb-2">
                Trending Communities
              </h3>
              <p className="text-muted-foreground">
                Coming soon - discover what's hot in the community
              </p>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default CommunityPage;
