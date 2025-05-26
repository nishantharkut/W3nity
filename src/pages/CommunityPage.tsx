
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockChatGroups, mockUsers } from '@/lib/mockData';
import { Search, Plus, Users, Hash, Lock, Globe, MessageSquare } from 'lucide-react';

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = mockChatGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publicGroups = filteredGroups.filter(group => group.type === 'public');
  const myGroups = filteredGroups.filter(group => 
    group.members.some(member => member.id === '1') // Current user ID
  );

  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  const GroupCard = ({ group }: { group: any }) => (
    <Card className="glass-effect card-hover">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-spark rounded-lg flex items-center justify-center">
              {getGroupIcon(group.type)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{group.name}</h3>
              <p className="text-sm text-muted-foreground">
                {group.members.length} members
              </p>
            </div>
          </div>
          <Badge variant={group.type === 'public' ? 'secondary' : 'outline'}>
            {group.type}
          </Badge>
        </div>
        
        {group.description && (
          <p className="text-muted-foreground line-clamp-2">{group.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex -space-x-2">
          {group.members.slice(0, 5).map((member: any) => (
            <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
              <AvatarImage src={member.avatar} alt={member.username} />
              <AvatarFallback className="text-xs">
                {member.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {group.members.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
              +{group.members.length - 5}
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          Last active: {new Date(group.lastActivity).toLocaleDateString()}
        </div>
        
        <Button className="w-full">
          <MessageSquare className="w-4 h-4 mr-2" />
          Join Chat
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">Connect and collaborate with the tech community</p>
        </div>
        <Button className="glow-button">
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-8 glass-effect">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search groups and channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="glass-effect">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-gradient">{mockChatGroups.length}</div>
            <div className="text-sm text-muted-foreground">Total Groups</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-gradient">{mockUsers.length}</div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-gradient">1.2K</div>
            <div className="text-sm text-muted-foreground">Messages Today</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-gradient">24</div>
            <div className="text-sm text-muted-foreground">Online Now</div>
          </CardContent>
        </Card>
      </div>

      {/* Group Tabs */}
      <Tabs defaultValue="explore" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 glass-effect">
          <TabsTrigger value="explore" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Explore ({publicGroups.length})</span>
          </TabsTrigger>
          <TabsTrigger value="my-groups" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>My Groups ({myGroups.length})</span>
          </TabsTrigger>
          <TabsTrigger value="trending">
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {publicGroups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
          {publicGroups.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">No public groups found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or create a new group
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-groups" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {myGroups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
          {myGroups.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">You haven't joined any groups yet</h3>
              <p className="text-muted-foreground">
                Explore public groups or create your own to get started
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="text-xl font-semibold mb-2">Trending Communities</h3>
            <p className="text-muted-foreground">
              Coming soon - discover what's hot in the community
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityPage;
