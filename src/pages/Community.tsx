
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Plus, Users, MessageSquare, Hash } from 'lucide-react';

const Community = () => {
  const [selectedGroup, setSelectedGroup] = useState('react-devs');
  const [message, setMessage] = useState('');

  const groups = [
    { id: 'react-devs', name: 'React Developers', members: 234, unread: 3 },
    { id: 'blockchain', name: 'Blockchain Enthusiasts', members: 156, unread: 0 },
    { id: 'ui-design', name: 'UI/UX Designers', members: 89, unread: 1 },
    { id: 'general', name: 'General Discussion', members: 445, unread: 0 },
  ];

  const messages = [
    { id: 1, user: 'Alice', avatar: 'A', message: 'Hey everyone! Just finished a new React project using hooks', time: '10:30 AM', isOwn: false },
    { id: 2, user: 'Bob', avatar: 'B', message: 'That sounds awesome! Would love to see it', time: '10:32 AM', isOwn: false },
    { id: 3, user: 'You', avatar: 'Y', message: 'I\'m working on a similar project. Would love to collaborate!', time: '10:35 AM', isOwn: true },
    { id: 4, user: 'Carol', avatar: 'C', message: 'Count me in! I have experience with TypeScript integration', time: '10:38 AM', isOwn: false },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row max-w-7xl mx-auto">
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Community</h2>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Group</span>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            <div className="bg-white p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-primary-600">50+</div>
              <div className="text-xs text-gray-600">Active Groups</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-tech-green">2.5K</div>
              <div className="text-xs text-gray-600">Messages Today</div>
            </div>
          </div>
        </div>

        {/* Groups List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Groups</h3>
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${
                  selectedGroup === group.id
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium text-sm">{group.name}</div>
                    <div className="text-xs text-gray-500">{group.members} members</div>
                  </div>
                </div>
                {group.unread > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {group.unread}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Hash className="h-5 w-5 text-gray-400" />
              <div>
                <h1 className="text-lg font-semibold">
                  {groups.find(g => g.id === selectedGroup)?.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {groups.find(g => g.id === selectedGroup)?.members} members
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Members</span>
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`${msg.isOwn ? 'text-right' : ''}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">{msg.user}</span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        msg.isOwn
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
