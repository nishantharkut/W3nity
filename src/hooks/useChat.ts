
import { useState, useEffect, useRef } from 'react';
import { Message, ChatGroup, User } from '@/types';

interface ChatState {
  activeGroup: ChatGroup | null;
  messages: Message[];
  groups: ChatGroup[];
  isConnected: boolean;
  isTyping: { [userId: string]: boolean };
}

export const useChat = (userId?: string) => {
  const [chatState, setChatState] = useState<ChatState>({
    activeGroup: null,
    messages: [],
    groups: [],
    isConnected: false,
    isTyping: {},
  });

  const socketRef = useRef<any>(null);

  // Mock Socket.io connection for development
  useEffect(() => {
    if (!userId) return;

    // Simulate connection
    setTimeout(() => {
      setChatState(prev => ({ ...prev, isConnected: true }));
      loadMockGroups();
    }, 1000);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  const loadMockGroups = () => {
    const mockGroups: ChatGroup[] = [
      {
        id: '1',
        name: 'General Discussion',
        description: 'Main community chat for all members',
        type: 'public',
        members: [],
        admins: ['1'],
        createdAt: new Date('2024-01-01'),
        lastActivity: new Date(),
        isArchived: false,
      },
      {
        id: '2',
        name: 'Web3 Developers',
        description: 'Discussion about blockchain and Web3 development',
        type: 'public',
        members: [],
        admins: ['1'],
        createdAt: new Date('2024-01-15'),
        lastActivity: new Date(),
        isArchived: false,
      },
      {
        id: '3',
        name: 'Freelance Tips',
        description: 'Share tips and experiences about freelancing',
        type: 'public',
        members: [],
        admins: ['1'],
        createdAt: new Date('2024-02-01'),
        lastActivity: new Date(),
        isArchived: false,
      },
    ];

    setChatState(prev => ({ ...prev, groups: mockGroups }));
  };

  const joinGroup = (groupId: string) => {
    const group = chatState.groups.find(g => g.id === groupId);
    if (group) {
      setChatState(prev => ({ ...prev, activeGroup: group }));
      loadMockMessages(groupId);
    }
  };

  const loadMockMessages = (groupId: string) => {
    const mockMessages: Message[] = [
      {
        id: '1',
        groupId,
        sender: {
          id: '2',
          username: 'alice_designer',
          email: 'alice@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
          skills: ['UI/UX', 'Figma'],
          rating: 4.9,
          reviewCount: 15,
          isVerified: true,
          joinedAt: new Date(),
        },
        content: 'Hey everyone! Just joined the platform. Excited to collaborate!',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000),
        reactions: [
          { emoji: '👋', users: ['1', '3'], count: 2 },
          { emoji: '🎉', users: ['1'], count: 1 },
        ],
      },
      {
        id: '2',
        groupId,
        sender: {
          id: '3',
          username: 'bob_fullstack',
          email: 'bob@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
          skills: ['React', 'Node.js'],
          rating: 4.7,
          reviewCount: 28,
          isVerified: true,
          joinedAt: new Date(),
        },
        content: 'Welcome Alice! 🚀 There are some great Web3 projects looking for designers.',
        type: 'text',
        timestamp: new Date(Date.now() - 3000000),
        reactions: [],
      },
    ];

    setChatState(prev => ({ ...prev, messages: mockMessages }));
  };

  const sendMessage = async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!chatState.activeGroup || !userId) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      groupId: chatState.activeGroup.id,
      sender: {
        id: userId,
        username: 'current_user',
        email: 'user@example.com',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        skills: [],
        rating: 0,
        reviewCount: 0,
        isVerified: false,
        joinedAt: new Date(),
      },
      content,
      type,
      timestamp: new Date(),
      reactions: [],
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    // Simulate socket emit
    console.log('Sending message:', newMessage);
  };

  const addReaction = (messageId: string, emoji: string) => {
    if (!userId) return;

    setChatState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            if (existingReaction.users.includes(userId)) {
              // Remove reaction
              return {
                ...msg,
                reactions: msg.reactions.map(r =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        users: r.users.filter(u => u !== userId),
                        count: r.count - 1,
                      }
                    : r
                ).filter(r => r.count > 0),
              };
            } else {
              // Add reaction
              return {
                ...msg,
                reactions: msg.reactions.map(r =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        users: [...r.users, userId],
                        count: r.count + 1,
                      }
                    : r
                ),
              };
            }
          } else {
            // New reaction
            return {
              ...msg,
              reactions: [
                ...msg.reactions,
                { emoji, users: [userId], count: 1 },
              ],
            };
          }
        }
        return msg;
      }),
    }));
  };

  const setTyping = (isTyping: boolean) => {
    // Simulate typing indicator
    console.log('Typing:', isTyping);
  };

  return {
    ...chatState,
    joinGroup,
    sendMessage,
    addReaction,
    setTyping,
  };
};
