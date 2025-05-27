import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GigCard from "@/components/GigCard";
import { Search, Filter, Plus } from "lucide-react";

const FreelancePage = () => {
  const navigate = useNavigate();

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const categories = [
    "all",
    "web-development",
    "mobile-development",
    "ui-ux-design",
    "blockchain",
    "ai-ml",
  ];
  const popularSkills = [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "Figma",
    "Solidity",
    "Web3",
    "Angular",
    "Vue.js",
    "Django",
    "Flask",
    "GraphQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Google Cloud",
    "Swift",
    "Kotlin",
    "Java",
    "C#",
    "Ruby on Rails",
    "PHP",
    "html",
    "Laravel",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Tailwind CSS",
    "Sass",
    "Redux",
    "Express.js",
    "TensorFlow",
    "PyTorch",
    "Blockchain",
    "NFT",
    "Machine Learning",
    "Artificial Intelligence",
    "CI/CD",
    "Jenkins",
    "SEO",
    "UI/UX Design",
    "Photoshop",
    "Illustrator",
  ];

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/gigs");
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setGigs(data); // assuming data is an array of gigs
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch gigs");
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || gig.category === selectedCategory;

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => gig.skills.includes(skill));

    return matchesSearch && matchesCategory && matchesSkills;
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Find Your Next Project</h1>
          <p className="text-muted-foreground">
            Discover amazing opportunities from top clients
          </p>
        </div>
        <Button
          className="glow-button"
          onClick={() => navigate("/freelance/create")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Post a Gig
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-8 glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search gigs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="mobile-development">
                  Mobile Development
                </SelectItem>
                <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                <SelectItem value="blockchain">Blockchain</SelectItem>
                <SelectItem value="ai-ml">AI/ML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {popularSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant={
                    selectedSkills.includes(skill) ? "default" : "outline"
                  }
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading and error states */}
      {loading && <p>Loading gigs...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Results */}
      {!loading && !error && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              {filteredGigs.length} Gigs Found
            </h2>
            <p className="text-muted-foreground">
              Showing results for your search criteria
            </p>
          </div>

          {/* Gig Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGigs.map((gig) => (
              <GigCard
                key={gig._id} // assuming gigs from backend have _id
                gig={gig}
                onViewDetails={(id) => navigate(`/gig/${id}`)}
                onPropose={(id) => navigate(`/gig/${id}/proposal`)}
              />
            ))}
          </div>

          {filteredGigs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No gigs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FreelancePage;
