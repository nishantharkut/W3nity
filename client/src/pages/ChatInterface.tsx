"use client";

import {
  Users,
  MessageCircle,
  Phone,
  Video,
  Paperclip,
  Smile,
  MoreHorizontal,
  Circle,
} from "lucide-react";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthState } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

let socket: any;

const ChatInterface = () => {
  const { id: groupId } = useParams();
  console.log(groupId);

  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/groups/${groupId}`
        );
        console.log(res);
        setGroupName(res.data.name);
      } catch (err) {
        console.error("Error fetching group:", err);
      }
    };

    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId]);

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthState();
  const { toast } = useToast();

  const [messages, setMessages] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [tab, setTab] = useState("ALL");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/groups`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setGroups(res.data);
      } catch (err) {
        console.error("Failed to fetch groups", err);
      }
    };

    if (isAuthenticated) {
      fetchGroups();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!user || !isAuthenticated) return;

    socket = io(`${import.meta.env.VITE_API_URL}`);

    socket.emit("joinGroup", {
      groupId,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });

    socket.on("groupMessages", (msgs: any[]) => {
      const normalizedMsgs = msgs.map((msg) => ({
        ...msg,
        sender: {
          _id: msg.sender?._id || msg.senderId || "unknown",
          username: msg.sender?.username || msg.senderName || "Unknown",
          email: msg.sender?.email || "No Email",
        },
      }));
      setMessages(normalizedMsgs);
    });

    socket.on("activeUsers", setActiveUsers);

    socket.on("newMessage", ({ message }: any) => {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          sender: {
            _id: message.sender?._id || message.senderId || "unknown",
            username:
              message.sender?.username || message.senderName || "Unknown",
            email: message.sender?.email || "No Email",
          },
        },
      ]);
    });

    return () => {
      socket.disconnect();

      if (socket) {
        socket.off("groupMessages");
        socket.off("activeUsers");
        socket.off("newMessage");
        socket.disconnect();
      }
    };
  }, [groupId, user, isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    socket.emit("sendMessage", {
      groupId,
      sender: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      text: newMessage,
    });

    toast({
      title: "Message Sent",
      description: "Your message was delivered.",
    });

    setNewMessage("");
  };

  const formatTimeAgo = (timestamp: string | number | Date): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000); // in seconds

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

    // For older than a day
    return time.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between gap-4 bg-gray-900 text-white px-4 py-3 shadow-md">
        <div className="flex gap-4 justify-center items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/community")}
            >
              {" "}
              <ArrowLeft className="w-5 h-5" />{" "}
            </Button>
            <h1 className="text-lg font-semibold">{groupName}</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {activeUsers.length} online
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-muted border-r p-3 hidden md:flex flex-col">
          <h2 className="font-bold text-lg mb-3">Your Groups</h2>

          <div className="flex mb-3 gap-2">
            {["ALL", "USERS", "GROUPS"].map((t) => (
              <Button
                key={t}
                size="sm"
                variant={tab === t ? "default" : "outline"}
                onClick={() => setTab(t)}
              >
                {t}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-full space-y-2">
            {/* GROUPS (ALL + GROUPS tab) */}
            {(tab === "ALL" || tab === "GROUPS") &&
              groups.map((group) => {
                const isActive = group._id === groupId;
                const type = group.type || "group";
                const unreadCount = group.unread || 0;
                const timeAgo = group.lastMessageTime
                  ? formatTimeAgo(group.lastMessageTime)
                  : "";

                return (
                  <div
                    key={group._id}
                    onClick={() => navigate(`/community/${group._id}}`)}
                    className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition 
            ${
              isActive
                ? "bg-gray-800 border border-green-400"
                : "hover:bg-gray-700 bg-gray-900"
            }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/icons/svg?seed=${group.name}`}
                        />
                        <AvatarFallback>
                          {group.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {group.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{type}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      {unreadCount > 0 && (
                        <div className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center mb-1">
                          {unreadCount}
                        </div>
                      )}
                      {type === "direct" && timeAgo && (
                        <span className="text-xs text-muted-foreground">
                          {timeAgo}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* USERS (ALL tab = activeUsers, USERS tab = all group members) */}
            {(tab === "ALL" || tab === "USERS") && (
              <>
                <div className="text-muted-foreground text-sm font-semibold mt-3 mb-1">
                  {tab === "ALL" ? "Active Users" : "Group Members"}
                </div>
                {(tab === "ALL"
                  ? activeUsers
                  : groups.find((g) => g._id === groupId)?.members || []
                ).map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between p-3 mb-2 rounded-lg cursor-default transition hover:bg-gray-700 bg-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                        />
                        <AvatarFallback>
                          {u.username[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {u.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </ScrollArea>
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <ScrollArea className="flex-1 overflow-y-auto pr-2">
            {messages.map((msg, idx) => {
              const isOwn = msg.sender?._id === user?._id;
              const msgDate = new Date(msg.createdAt);
              const showDateHeader =
                idx === 0 ||
                new Date(messages[idx - 1].createdAt).toDateString() !==
                  msgDate.toDateString();

              return (
                <React.Fragment key={idx}>
                  {showDateHeader && (
                    <div className="text-center text-xs text-gray-500 my-4">
                      {msgDate.toLocaleDateString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  )}
                  <div
                    className={`flex mb-3 ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isOwn && (
                      <Avatar className="mr-2">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender.username}`}
                        />
                        <AvatarFallback>
                          {msg.sender?.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <Card
                      className={`max-w-sm p-3 px-4 ${
                        isOwn
                          ? "bg-blue-500 text-white rounded-tr-none after:absolute after:top-0 after:right-0 after:w-0 after:h-0 after:border-t-[10px] after:border-t-transparent after:border-l-[10px] after:border-l-blue-500 after:translate-x-full"
                          : "bg-muted rounded-tl-none after:absolute after:top-0 after:left-0 after:w-0 after:h-0 after:border-t-[10px] after:border-t-transparent after:border-r-[10px] after:border-r-muted after:-translate-x-full"
                      }`}
                    >
                      <div className="text-xs font-medium mb-1">
                        {msg.sender.username}
                      </div>
                      <div>{msg.text}</div>
                      <div
                        className={`text-[10px] mt-1 ${
                          isOwn ? "text-white/80" : "text-gray-500"
                        }`}
                      >
                        {msgDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </Card>
                    {isOwn && (
                      <Avatar className="ml-2">
                        <AvatarFallback>
                          {user.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </React.Fragment>
              );
            })}

            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="mt-3 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
            />
            <Button onClick={sendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
