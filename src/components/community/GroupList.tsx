
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useChat } from '@/hooks/useChat';

const GroupList = () => {
  const { groups, loading, joinGroup } = useChat();

  if (loading) {
    return <div className="text-center py-12">Loading Chat Groups...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <Card key={group.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{group.name}</span>
              {group.isPrivate && <Badge variant="secondary">Private</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{group.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">{group.members} members</span>
            </div>
            <Button 
              className="w-full" 
              onClick={() => joinGroup(group.id)}
            >
              Join Group
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GroupList;
