
import { useState, useEffect } from 'react';

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  lastMessage?: Message;
  isPrivate: boolean;
}

export const useChat = (groupId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: integrate API
    const fetchChatData = async () => {
      try {
        setLoading(true);
        // Mock data for now
        const mockGroups: ChatGroup[] = [
          {
            id: '1',
            name: 'React Developers',
            description: 'Discussion about React and related technologies',
            members: 234,
            isPrivate: false
          },
          {
            id: '2',
            name: 'Blockchain Enthusiasts',
            description: 'Web3, DeFi, and cryptocurrency discussions',
            members: 156,
            isPrivate: false
          }
        ];

        const mockMessages: Message[] = [
          {
            id: '1',
            content: 'Welcome to the React Developers group!',
            sender: 'Admin',
            timestamp: new Date().toISOString(),
            type: 'text'
          }
        ];

        setGroups(mockGroups);
        setMessages(mockMessages);
      } catch (err) {
        setError('Failed to fetch chat data');
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [groupId]);

  const sendMessage = async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    // TODO: integrate API
    console.log('Sending message:', content, type);
  };

  const joinGroup = async (groupId: string) => {
    // TODO: integrate API
    console.log('Joining group:', groupId);
  };

  return {
    messages,
    groups,
    loading,
    error,
    sendMessage,
    joinGroup
  };
};
