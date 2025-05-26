
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGigs } from '@/hooks/useGigs';
import ProposalForm from './ProposalForm';

const GigDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { gigs } = useGigs();
  const [showProposalForm, setShowProposalForm] = React.useState(false);

  const gig = gigs.find(g => g.id === id);

  if (!gig) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Gig Not Found</h1>
          <p className="text-gray-600 mb-8">The gig you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/freelance">Back to Freelance</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (showProposalForm) {
    return <ProposalForm gig={gig} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to="/freelance">← Back to Freelance</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{gig.title}</CardTitle>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant={gig.status === 'open' ? 'default' : 'outline'}>
                    {gig.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Posted by {gig.clientName}
                  </span>
                </div>
                <span className="text-3xl font-bold text-green-600">
                  ${gig.budget.toLocaleString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Project Description</h3>
                  <p className="text-gray-700 leading-relaxed">{gig.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {gig.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Deadline</p>
                    <p className="text-lg">{new Date(gig.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Proposals</p>
                    <p className="text-lg">{gig.proposals} submitted</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About the Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">{gig.clientName}</p>
                  <p className="text-sm text-gray-600">Member since 2023</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Total jobs posted: 5 • Hire rate: 80% • Open jobs: 2
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Button 
                className="w-full mb-4" 
                size="lg"
                onClick={() => setShowProposalForm(true)}
                disabled={gig.status !== 'open'}
              >
                {gig.status === 'open' ? 'Submit Proposal' : 'Gig Closed'}
              </Button>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Project Type</span>
                  <span>Fixed Price</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience Level</span>
                  <span className="capitalize">Intermediate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Project Length</span>
                  <span>3-6 months</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Identity Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Payment Method Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Phone Pending</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;
