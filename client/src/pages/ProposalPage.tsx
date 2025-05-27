import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { mockGigs } from '@/lib/mockData';
import { useWeb3 } from '@/hooks/useWeb3';
import { getEscrowInstance } from '@/lib/escrow';

const ESCROW_CONTRACT_ADDRESS = "0x21Ed0dC8810420c09a6507427F77fEF286121aC6";

const ProposalPage = () => {
  const { signer } = useWeb3();
  const { id } = useParams();
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const gig = mockGigs.find(g => g.id === id);

  const handleRelease = async () => {
    if (!signer) {
      setTxStatus("⚠️ Please connect your wallet to proceed.");
      return;
    }
    try {
      setIsReleasing(true);
      const contract = getEscrowInstance(signer, ESCROW_CONTRACT_ADDRESS);
      const tx = await contract.releaseFunds();
      await tx.wait();
      setTxStatus("Funds released successfully!");
    } catch (err: any) {
      const code = err.code || err.info?.error?.code;
      const message =
        err.reason ||
        err.shortMessage ||
        err.message ||
        err.info?.error?.message ||
        "An unknown error occurred.";

      if (code === 4001 || code === "ACTION_REJECTED") {
        setTxStatus("Transaction rejected by user.");
      } else {
        setTxStatus(`Error: ${message}`);
      }
    }
    finally {
      setIsReleasing(false);
    }
  };

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

  const isFormInvalid = !coverLetter || !proposedBudget || !deliveryTime;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => navigate(`/gig/${id}`)} className="mb-6">
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
                <Button type="submit" className="glow-button" disabled={isFormInvalid}>
                  Submit Proposal
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(`/gig/${id}`)}>
                  Cancel
                </Button>
              </div>
            </form>

            {/* Escrow Release UI */}
            <div className="mt-10 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Escrow Actions</h3>
              <Button onClick={handleRelease} disabled={isReleasing}>
                {isReleasing ? "Releasing..." : "Release Escrow"}
              </Button>
              {txStatus && (
                <p className={`mt-2 text-sm ${txStatus.startsWith("Error") ? "text-red-500" : "text-green-500"}`}>
                  {txStatus}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProposalPage;
