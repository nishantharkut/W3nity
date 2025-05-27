"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthState } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";

let socket;

const ChatInterface = () => {
  const params = useParams();
  const navigate = useNavigate();
  const groupId = params.groupId;
  const groupName = decodeURIComponent(params.groupName || "Group Chat");
  const { user, isAuthenticated } = useAuthState();
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

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

    socket.on("groupMessages", (msgs) => {
      const normalizedMsgs = msgs.map((msg) => ({
        ...msg,
        sender: {
          _id: (msg.sender?._id || msg.senderId || "unknown").toString(),
          username: msg.sender?.username || msg.senderName || "Unknown",
          email: msg.sender?.email || "No Email",
        },
      }));
      setMessages(normalizedMsgs);
    });

    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });

    socket.on("newMessage", ({ message }) => {
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

  const sendMessage = () => {
    if (newMessage.trim() && user) {
      socket.emit("sendMessage", {
        groupId,
        sender: {
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
        text: newMessage,
      });
      setNewMessage("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-3 shadow-md">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate("/community")} size="sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">{groupName}</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-white border-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "Hide Users" : "Show Users"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 min-w-[200px] bg-gray-900 text-white border-r p-4 overflow-y-auto">
            <h2 className="font-bold mb-4 text-xl">Active Users</h2>
            <div className="space-y-4">
              {activeUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center p-3 border border-gray-700 rounded-lg bg-gray-800"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold mr-3">
                    {user.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-gray-400 break-all">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex-1 overflow-y-auto pr-2">
            {messages.map((msg, idx) => {
              const isOwnMessage = msg.sender?._id?.toString() === user?._id?.toString();
              return (
                <div
                  key={idx}
                  className={`flex items-start mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  {!isOwnMessage && (
                    <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center mr-2 text-lg font-semibold">
                      {msg.sender?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div
                    className={`max-w-sm px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                  >
                    <strong className="block text-sm mb-1">
                      {msg.sender?.username || "Unknown"}
                    </strong>
                    <span>{msg.text}</span>
                  </div>
                  {isOwnMessage && (
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center ml-2 text-lg font-semibold">
                      {msg.sender?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex space-x-2 mt-4">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
