
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useGigs } from '@/hooks/useGigs';

const FeaturedGigs = () => {
  const { gigs, loading } = useGigs();

  if (loading) {
    return <div className="text-center py-12">Loading Featured Gigs...</div>;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Opportunities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover high-quality freelance projects from top companies looking for skilled developers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {gigs.slice(0, 3).map((gig) => (
            <Card key={gig.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{gig.title}</CardTitle>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">${gig.budget.toLocaleString()}</span>
                  <Badge variant="secondary">{gig.proposals} proposals</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {gig.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">By {gig.clientName}</span>
                  <Button size="sm" asChild>
                    <Link to={`/freelance/gig/${gig.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/freelance">View All Opportunities</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGigs;
