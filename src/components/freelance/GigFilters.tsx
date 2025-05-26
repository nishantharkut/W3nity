
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

interface FilterState {
  search: string;
  category: string;
  experienceLevel: string;
  minBudget: number;
  maxBudget: number;
  skills: string[];
}

interface GigFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const GigFilters: React.FC<GigFiltersProps> = ({ filters, onFilterChange, onClearFilters }) => {
  const [skillInput, setSkillInput] = React.useState('');

  const addSkill = () => {
    if (skillInput.trim() && !filters.skills.includes(skillInput.trim())) {
      onFilterChange({
        ...filters,
        skills: [...filters.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onFilterChange({
      ...filters,
      skills: filters.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.search || filters.category || filters.experienceLevel || 
    filters.minBudget > 0 || filters.maxBudget > 0 || filters.skills.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Opportunities
        </CardTitle>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search gigs by title or description..."
            className="pl-10"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        {/* Category and Experience Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={filters.category} onValueChange={(value) => updateFilter('category', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="mobile-development">Mobile Development</SelectItem>
                <SelectItem value="blockchain">Blockchain & Web3</SelectItem>
                <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                <SelectItem value="design">UI/UX Design</SelectItem>
                <SelectItem value="devops">DevOps & Infrastructure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Experience Level</label>
            <Select value={filters.experienceLevel} onValueChange={(value) => updateFilter('experienceLevel', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <label className="text-sm font-medium mb-2 block">Budget Range ($)</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minBudget || ''}
              onChange={(e) => updateFilter('minBudget', Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxBudget || ''}
              onChange={(e) => updateFilter('maxBudget', Number(e.target.value))}
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="text-sm font-medium mb-2 block">Skills</label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add skill filter..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" onClick={addSkill} size="icon" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {filters.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GigFilters;
