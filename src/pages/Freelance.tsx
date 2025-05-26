
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import GigFilters from '@/components/freelance/GigFilters';
import GigList from '@/components/freelance/GigList';

interface FilterState {
  search: string;
  category: string;
  experienceLevel: string;
  minBudget: number;
  maxBudget: number;
  skills: string[];
}

const Freelance = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    experienceLevel: '',
    minBudget: 0,
    maxBudget: 0,
    skills: []
  });

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      experienceLevel: '',
      minBudget: 0,
      maxBudget: 0,
      skills: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Project</h1>
              <p className="text-gray-600">Discover exciting opportunities from top tech companies and startups</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Button asChild className="bg-primary-600 hover:bg-primary-700">
                <Link to="/freelance/create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Post a Project
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <GigFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Available Projects</h2>
                <div className="text-sm text-gray-600">
                  Showing all opportunities
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-gray-900">2</div>
                  <div className="text-sm text-gray-600">Open Projects</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">$13K</div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">20</div>
                  <div className="text-sm text-gray-600">Total Proposals</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-purple-600">6</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
              </div>
            </div>

            {/* Gig List */}
            <GigList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Freelance;
