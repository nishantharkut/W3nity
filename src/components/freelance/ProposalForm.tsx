
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send } from 'lucide-react';
import { Gig } from '@/hooks/useGigs';
import { useNavigate } from 'react-router-dom';

const proposalSchema = z.object({
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
  proposedBudget: z.number().min(1, 'Proposed budget must be greater than 0'),
  timeline: z.string().min(10, 'Timeline must be at least 10 characters'),
  portfolio: z.string().url().optional().or(z.literal('')),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProposalFormProps {
  gig: Gig;
}

const ProposalForm: React.FC<ProposalFormProps> = ({ gig }) => {
  const navigate = useNavigate();
  
  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      coverLetter: '',
      proposedBudget: gig.budget,
      timeline: '',
      portfolio: '',
    },
  });

  const onSubmit = async (data: ProposalFormData) => {
    // TODO: integrate API
    console.log('Submitting proposal:', data);
    // Simulate success
    alert('Proposal submitted successfully!');
    navigate(`/freelance/gig/${gig.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Button
        variant="outline"
        onClick={() => navigate(`/freelance/gig/${gig.id}`)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Gig
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proposal Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Submit Your Proposal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="coverLetter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Letter</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explain why you're the perfect fit for this project..."
                            className="min-h-[150px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="proposedBudget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proposed Budget ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="5000"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Timeline</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2-3 weeks" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="portfolio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio Link (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://yourportfolio.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full md:w-auto">
                    Submit Proposal
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Gig Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{gig.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget</p>
                <p className="text-2xl font-bold text-green-600">${gig.budget.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-1">
                  {gig.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Client</p>
                <p className="text-sm">{gig.clientName}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Deadline</p>
                <p className="text-sm">{new Date(gig.deadline).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProposalForm;
