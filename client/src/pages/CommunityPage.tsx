"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const CommunityPage = () => {
  const navigate=useNavigate()
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
      const res = await fetch("http://localhost:8080/api/groups");
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
      const res = await fetch("http://localhost:8080/api/groups", {
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
        `http://localhost:8080/api/groups/${groupId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user._id }),
        }
      );

      if (res.ok) {
        const updatedGroup = await res.json();
        setGroups((prev) =>
          prev.map((g) => (g._id === updatedGroup._id ? updatedGroup : g))
        );
        navigate(`/community/${groupId}`)
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
        {group?.members?.some((member) => member._id === user._id)  ? (
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
            onClick={() => handleJoinGroup(group._id)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Join Chat
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Community</h1>
          <p className="text-muted-foreground">
            Connect with others and explore groups
          </p>
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
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="explore"
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="explore">
            <Globe className="w-4 h-4 mr-2" /> Explore
          </TabsTrigger>
          <TabsTrigger value="my-groups">
            <Users className="w-4 h-4 mr-2" /> My Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explore">
          {filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <GroupCard key={group._id} group={group} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No groups found. Try creating one!
            </p>
          )}
        </TabsContent>

        <TabsContent value="my-groups">
          {filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGroups
                .filter((g) =>
                  g.members?.some((m: any) => {
                    if (!m) return false; 
                    if (typeof m === "string") return m === user._id;

                    
                    if (typeof m === "object")
                      return m._id === user._id || m.id === user._id;

                    return false;
                  })
                )

                .map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              You're not part of any groups yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityPage;
