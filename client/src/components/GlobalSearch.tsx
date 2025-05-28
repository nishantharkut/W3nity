import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "gig" | "event" | "user" | "community";
  url: string;
  metadata?: {
    avatar?: string;
    skills?: string[];
    date?: string;
    price?: string;
    location?: string;
  };
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search data
  const mockData: SearchResult[] = [
    {
      id: "1",
      title: "React Developer needed for E-commerce",
      description:
        "Looking for an experienced React developer to build a modern e-commerce platform",
      type: "gig",
      url: "/gig/1",
      metadata: {
        price: "$2,000 - $3,000",
        skills: ["React", "TypeScript", "Node.js"],
      },
    },
    {
      id: "2",
      title: "Tech Meetup 2024",
      description: "Join us for the biggest tech meetup of the year",
      type: "event",
      url: "/event/2",
      metadata: {
        date: "Dec 20, 2024",
        location: "San Francisco",
      },
    },
    {
      id: "3",
      title: "Sarah Johnson",
      description: "Full-stack developer with 5+ years experience",
      type: "user",
      url: "/profile/sarah",
      metadata: {
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
        skills: ["React", "Node.js", "Python"],
      },
    },
    {
      id: "4",
      title: "Web3 Developers",
      description: "Community for blockchain and Web3 developers",
      type: "community",
      url: "/community/web3",
      metadata: {},
    },
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = mockData.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.metadata?.skills?.some((skill) =>
              skill.toLowerCase().includes(query.toLowerCase())
            )
        );
        setResults(filtered);
        setIsLoading(false);
        setSelectedIndex(-1);
      }, 300);
    } else {
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    onClose();
    setQuery("");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "gig":
        return <Briefcase className="w-4 h-4" />;
      case "event":
        return <Calendar className="w-4 h-4" />;
      case "user":
        return <Users className="w-4 h-4" />;
      case "community":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (
    type: string
  ): "default" | "destructive" | "secondary" | "outline" => {
    switch (type) {
      case "gig":
        return "default";
      case "event":
        return "secondary";
      case "user":
        return "outline";
      case "community":
        return "destructive";
      default:
        return "default";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <Card className="w-full max-w-2xl mx-4">
        <CardContent className="p-0">
          <div className="flex items-center border-b px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <Input
              ref={inputRef}
              placeholder="Search gigs, events, people, and communities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 focus-visible:ring-0 text-lg"
            />
            <Button variant="ghost" onClick={onClose} className="ml-2">
              Esc
            </Button>
          </div>

          {query.length > 2 && (
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Searching...
                  </p>
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <div
                      key={result.id}
                      className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 ${
                        selectedIndex === index
                          ? "bg-gray-100"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex-shrink-0">
                        {result.type === "user" && result.metadata?.avatar ? (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={result.metadata.avatar} />
                            <AvatarFallback>
                              {result.title.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {getTypeIcon(result.type)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm truncate">
                            {result.title}
                          </h4>
                          <Badge
                            variant={getTypeBadge(result.type)}
                            className="text-xs"
                          >
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {result.description}
                        </p>

                        {result.metadata && (
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            {result.metadata.price && (
                              <span>{result.metadata.price}</span>
                            )}
                            {result.metadata.date && (
                              <span>{result.metadata.date}</span>
                            )}
                            {result.metadata.location && (
                              <span>{result.metadata.location}</span>
                            )}
                            {result.metadata.skills && (
                              <div className="flex gap-1">
                                {result.metadata.skills
                                  .slice(0, 2)
                                  .map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="outline"
                                      className="text-xs py-0"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No results found for "{query}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try different keywords or browse categories
                  </p>
                </div>
              )}
            </div>
          )}

          {query.length <= 2 && (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Start typing to search across the platform
              </p>
              <div className="flex justify-center gap-2 mt-3">
                <Badge variant="outline">Gigs</Badge>
                <Badge variant="outline">Events</Badge>
                <Badge variant="outline">People</Badge>
                <Badge variant="outline">Communities</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalSearch;
