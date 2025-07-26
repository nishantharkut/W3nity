
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, DollarSign, Clock, Users, ArrowRight, ArrowLeft, FileText, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EnhancedGigCreation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const [gigData, setGigData] = useState({
    title: '',
    description: '',
    category: '',
    skills: [],
    minBudget: '',
    maxBudget: '', // fixed the duplicate key
    budgetType: 'fixed',
    experienceLevel: 'intermediate',
    duration: '',
    deadline: null, // use null for a date field
    requirements: '',
    deliverables: '',
    attachments: [] // assuming this will store files or URLs
  });
  

  const [skillInput, setSkillInput] = useState('');


  const token = JSON.parse(
    localStorage.getItem("sparkverse-auth") || "{}"
  )?.token;
  console.log(token)

  const categories = [
    { value: 'ai-ml', label: 'AI & Machine Learning' },
    { value: 'app-development', label: 'App Development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'design', label: 'Design' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'other', label: 'Other' },
  ];

  const popularSkills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Figma', 'Solidity', 'Web3',
    'Next.js', 'Vue.js', 'Angular', 'PHP', 'Java', 'C++', 'Swift', 'Kotlin'
  ];

  const addSkill = (skill) => {
    if (skill && !gigData.skills.includes(skill)) {
      setGigData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setGigData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const {
      title,
      description,
      category,
      minBudget,
      maxBudget,
      deadline,
      duration,
      budgetType,
      experienceLevel,
      skills,
      requirements,
      deliverables,
      attachments
    } = gigData;
  
    const payload = {
      title,
      description,
      category,
      minBudget: Number(minBudget),
      maxBudget: Number(maxBudget),
      deadline: deadline ? new Date(deadline) : null,
      duration,
      budgetType,
      experienceLevel,
      skills,
      requirements,
      deliverables,
      attachments
    };
    
    console.log('Submitting gig with category:', category);
    console.log('Full payload:', payload);
  
    try {
      const token = JSON.parse(localStorage.getItem('sparkverse-auth') || '{}')?.token;
  
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gigs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }
  
      const data = await res.json();
      console.log("Gig created:", data);
      navigate("/freelance");
    } catch (error) {
      console.error("Error creating gig:", error.message);
    }
  };
  



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-effect mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Create a New Gig</CardTitle>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i <= step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="glass-effect">
          <CardContent className="pt-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">Basic Information</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Project Title</label>
                  <Input
                    value={gigData.title}
                    onChange={(e) => setGigData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Build a React Dashboard with Real-time Analytics"
                    className="text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={gigData.category} onValueChange={(value) => {
                    console.log('Category selected:', value);
                    setGigData(prev => ({ ...prev, category: value }));
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {gigData.category && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {categories.find(cat => cat.value === gigData.category)?.label || gigData.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Description</label>
                  <Textarea
                    value={gigData.description}
                    onChange={(e) => setGigData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your project in detail. What are you looking to build?"
                    rows={6}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      console.log('Current gigData:', gigData);
                      setStep(2);
                    }}
                    disabled={!gigData.title || !gigData.category || !gigData.description}
                    className="glow-button"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Skills & Requirements */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">Skills & Requirements</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Required Skills</label>
                  <div className="flex space-x-2 mb-3">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill..."
                      onKeyPress={(e) => e.key === 'Enter' && addSkill(skillInput)}
                    />
                    <Button onClick={() => addSkill(skillInput)} type="button">Add</Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {popularSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addSkill(skill)}
                      >
                        + {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {gigData.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level Required</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['entry', 'intermediate', 'expert']).map((level) => (
                      <Button
                        key={level}
                        variant={gigData.experienceLevel === level ? "default" : "outline"}
                        onClick={() => setGigData(prev => ({ ...prev, experienceLevel: level }))}
                        className="capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Specific Requirements</label>
                  <Textarea
                    value={gigData.requirements}
                    onChange={(e) => setGigData(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="Any specific requirements, qualifications, or preferences for freelancers"
                    rows={4}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={gigData.skills.length === 0}
                    className="glow-button"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Budget & Timeline */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">Budget & Timeline</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Budget Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={gigData.budgetType === 'fixed' ? "default" : "outline"}
                      onClick={() => setGigData(prev => ({ ...prev, budgetType: 'fixed' }))}
                    >
                      Fixed Price
                    </Button>
                    <Button
                      variant={gigData.budgetType === 'hourly' ? "default" : "outline"}
                      onClick={() => setGigData(prev => ({ ...prev, budgetType: 'hourly' }))}
                    >
                      Hourly Rate
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Minimum Budget ($)
                    </label>
                    <Input
                      type="number"
                      value={gigData.minBudget}
                      onChange={(e) => setGigData(prev => ({ ...prev, minBudget: e.target.value }))}
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Maximum Budget ($)
                    </label>
                    <Input
                      type="number"
                      value={gigData.maxBudget}
                      onChange={(e) => setGigData(prev => ({ ...prev, maxBudget: e.target.value }))}
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Duration</label>
                    <Input
                      value={gigData.duration}
                      onChange={(e) => setGigData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 30 days, 2 weeks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Deadline</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {gigData.deadline ? format(gigData.deadline, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={gigData.deadline}
                          onSelect={(date) => setGigData(prev => ({ ...prev, deadline: date }))}
                          initialFocus
                          disabled={{ before: new Date() }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    disabled={!gigData.minBudget || !gigData.maxBudget || !gigData.duration}
                    className="glow-button"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Deliverables & Review */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">Deliverables & Review</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expected Deliverables</label>
                  <Textarea
                    value={gigData.deliverables}
                    onChange={(e) => setGigData(prev => ({ ...prev, deliverables: e.target.value }))}
                    placeholder="What should the freelancer deliver? (e.g., Source code, Documentation, Deployment)"
                    rows={4}
                  />
                </div>

                {/* Project Summary */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Project Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <strong>Title:</strong> {gigData.title}
                    </div>
                    <div>
                      <strong>Category:</strong> {gigData.category}
                    </div>
                    <div>
                      <strong>Budget:</strong> ${gigData.minBudget} - ${gigData.maxBudget} ({gigData.budgetType})
                    </div>
                    <div>
                      <strong>Duration:</strong> {gigData.duration}
                    </div>
                    <div>
                      <strong>Skills:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {gigData.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="glow-button"
                    disabled={!gigData.deliverables}
                  >
                    Post Gig
                    <Users className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedGigCreation;