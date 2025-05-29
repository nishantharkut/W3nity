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
import { GigCardSkeleton } from "@/components/LoadingStates";
import { mockGigs } from "@/lib/mockData";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Plus,
  Grid,
  List,
  TrendingUp,
  Star,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
    },
  }),
};

const FreelancePage = () => {
  const navigate = useNavigate();

  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [gigs, setGigs] = useState([]);

  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

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
  ];

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/gigs");
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setGigs(data);
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
      gig.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      gig.description.toLowerCase().includes(debouncedSearch.toLowerCase());
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
    toast({
      title: selectedSkills.includes(skill) ? "Skill Removed" : "Skill Added",
      description: `${skill} ${
        selectedSkills.includes(skill) ? "removed from" : "added to"
      } filter`,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSkills([]);
    toast({
      title: "Filters Cleared",
      description: "All search filters have been reset",
    });
  };

  const handleCreateGig = () => {
    navigate("/freelance/create");
    toast({
      title: "Create New Gig",
      description: "Starting the gig creation process",
    });
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    toast({
      title: "View Changed",
      description: `Switched to ${mode} view`,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 2) {
      toast({
        title: "Searching",
        description: `Looking for gigs matching "${value}"`,
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    toast({
      title: "Category Selected",
      description:
        category === "all"
          ? "Showing all categories"
          : `Filtering by ${category.replace("-", " ")}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Find Your Next Project
          </h1>
          <p className="text-muted-foreground">
            Discover amazing opportunities from top clients worldwide
          </p>
          <motion.div
            className="flex items-center gap-4 mt-2 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{filteredGigs.length} active gigs</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>4.8 avg rating</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>$50-5000 budget range</span>
            </div>
          </motion.div>
        </div>
        <Button
          className="glow-button w-full sm:w-auto"
          onClick={handleCreateGig}
        >
          <Plus className="w-4 h-4 mr-2" />
          Post a Gig
        </Button>
      </motion.div>

      {/* Enhanced Filters */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <Card className="glass-effect border-2 border-primary/10">
          <CardHeader asChild>
            <motion.div variants={fadeInUp}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Search & Filters
                </div>
                {(selectedSkills.length > 0 ||
                  selectedCategory !== "all" ||
                  searchQuery) && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All (
                    {selectedSkills.length +
                      (selectedCategory !== "all" ? 1 : 0) +
                      (searchQuery ? 1 : 0)}
                    )
                  </Button>
                )}
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.div
              className="flex flex-col lg:flex-row gap-4"
              variants={fadeInUp}
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search gigs by title, description, or skills..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="lg:w-48 h-12">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="web-development">
                    Web Development
                  </SelectItem>
                  <SelectItem value="mobile-development">
                    Mobile Development
                  </SelectItem>
                  <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                  <SelectItem value="blockchain">Blockchain</SelectItem>
                  <SelectItem value="ai-ml">AI/ML</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Popular Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularSkills.map((skill, index) => (
                  <motion.div key={skill} custom={index} variants={fadeInUp}>
                    <Badge
                      variant={
                        selectedSkills.includes(skill) ? "default" : "outline"
                      }
                      className="cursor-pointer hover:scale-105 transition-all duration-200 px-3 py-1"
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                      {selectedSkills.includes(skill) && " ✓"}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-1">
            {filteredGigs.length} Gigs Found
          </h2>
          <p className="text-muted-foreground text-sm">
            {selectedSkills.length > 0 ||
            selectedCategory !== "all" ||
            searchQuery
              ? "Showing filtered results"
              : "Showing all available gigs"}
          </p>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewModeChange("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewModeChange("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced Gig Grid/List */}
      {loading ? (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {[...Array(6)].map((_, i) => (
            <GigCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredGigs.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredGigs.map((gig,i) => (
            <motion.div
            key={gig.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <GigCard
              key={gig.id}
              gig={gig}
              onViewDetails={(id) => {
                navigate(`/gig/${id}`);
                toast({
                  title: "Viewing Gig",
                  description: "Loading gig details",
                });
              }}
              onPropose={(id) => {
                navigate(`/gig/${id}/proposal`);
                toast({
                  title: "Creating Proposal",
                  description: "Opening proposal form",
                });
              }}
            />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center py-12 border-2 border-dashed border-muted">
          <CardContent>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No gigs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms to find more
              opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
              <Button onClick={handleCreateGig} className="glow-button">
                <Plus className="w-4 h-4 mr-2" />
                Post Your Own Gig
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      )}
    </div>
  );
};

export default FreelancePage;
