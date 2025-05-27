import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X } from "lucide-react";

const CreateGigPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  // const [budget, setBudget] = useState('');
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const [deadline, setDeadline] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectLength, setProjectLength] = useState("");
  const [projectType, setProjectType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const gigData = {
      title,
      description,
      category,
      minBudget: Number(minBudget),
      maxBudget: Number(maxBudget),
      deadline: new Date(deadline),
      clientName,
      projectLength,
      projectType,
      experienceLevel,
      skills,
    };

    try {
      const res = await fetch("http://localhost:8080/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gigData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("Gig created:", data);
      navigate("/freelance");
    } catch (error: any) {
      console.error("Error creating gig:", error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        onClick={() => navigate("/freelance")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Freelance
      </Button>

      <Card className="max-w-3xl mx-auto glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl">Post a New Gig</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Build a React Dashboard"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project in detail..."
                rows={4}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">
                      Web Development
                    </SelectItem>
                    <SelectItem value="mobile-development">
                      Mobile Development
                    </SelectItem>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                    <SelectItem value="ai-ml">AI/ML</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Experience Level
                </label>
                <Select
                  value={experienceLevel}
                  onValueChange={setExperienceLevel}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Min Budget ($)
                  </label>
                  <Input
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    placeholder="e.g., 500"
                    required
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Max Budget ($)
                  </label>
                  <Input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="e.g., 2000"
                    required
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deadline
                </label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Client Name
              </label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Your client or company name"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Length
                </label>
                <Input
                  value={projectLength}
                  onChange={(e) => setProjectLength(e.target.value)}
                  placeholder="e.g., 2-3 weeks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Type
                </label>
                <Input
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  placeholder="e.g., Fixed Price, Hourly"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Skills Required
              </label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                />
                <Button type="button" onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="cursor-pointer"
                  >
                    {skill}
                    <X
                      className="w-3 h-3 ml-1"
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="glow-button">
                Post Gig
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/freelance")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGigPage;
``;
