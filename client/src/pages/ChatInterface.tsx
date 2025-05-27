"use client";

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

let socket: any;

const ChatInterface = () => {
  const { groupId, groupName: rawGroupName } = useParams();
  const groupName = decodeURIComponent(rawGroupName || "Group Chat");
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
        const res = await axios.get("http://localhost:8080/api/groups", {
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

    socket = io("http://localhost:8080");

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

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-start gap-4 bg-gray-900 text-white px-4 py-3 shadow-md">
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
                    onClick={() =>
                      navigate(
                        `/chat/${group._id}/${encodeURIComponent(group.name)}`
                      )
                    }
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
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} />
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
              return (
                <div
                  key={idx}
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
                    className={`max-w-sm p-3 ${
                      isOwn ? "bg-blue-500 text-white" : "bg-muted"
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
                      {new Date(msg.createdAt).toLocaleTimeString([], {
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
