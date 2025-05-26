
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { mockGigs } from '@/lib/mockData';

const ProposalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  
  const gig = mockGigs.find(g => g.id === id);
  
  if (!gig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Gig not found</h1>
          <Button onClick={() => navigate('/freelance')}>Back to Freelance</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting proposal:', {
      gigId: id,
      coverLetter,
      proposedBudget: Number(proposedBudget),
      deliveryTime: Number(deliveryTime)
    });
    navigate(`/gig/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate(`/gig/${id}`)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Gig
      </Button>

      <div className="max-w-3xl mx-auto">
        <Card className="glass-effect mb-6">
          <CardHeader>
            <CardTitle>Submit Proposal</CardTitle>
            <p className="text-muted-foreground">for "{gig.title}"</p>
          </CardHeader>
        </Card>

        <Card className="glass-effect">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Cover Letter</label>
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain why you're the best fit for this project..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Proposed Budget ($)</label>
                  <Input
                    type="number"
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(e.target.value)}
                    placeholder={`${gig.budget.min} - ${gig.budget.max}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Time (days)</label>
                  <Input
                    type="number"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    placeholder="7"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="glow-button">
                  Submit Proposal
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/gig/${id}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProposalPage;
