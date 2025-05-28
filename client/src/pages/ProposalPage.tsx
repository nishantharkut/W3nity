import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { getEscrowInstance } from '@/lib/escrow';
import axios from "axios";
import EscrowABI from '@/lib/Escrow.json';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
const ESCROW_CONTRACT_ADDRESS = "0x21Ed0dC8810420c09a6507427F77fEF286121aC6";
import { useAuthState } from "../hooks/useAuth";
const ProposalPage = () => {
  const { user, isAuthenticated } = useAuthState();
  const { signer } = useWeb3();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [gig, setGig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [coverLetter, setCoverLetter] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const [isReleasing, setIsReleasing] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  // Fetch gig from backend
  useEffect(() => {
    const fetchGig = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/gigs/${id}`);
        setGig(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load gig data.");
        setGig(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGig();
  }, [id]);

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
    } finally {
      setIsReleasing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading gig details...</p>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Gig not found</h1>
        <p className="mb-4">{error || "No gig data available."}</p>
        <Button onClick={() => navigate('/freelance')}>Back to Freelance</Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Ensure user and wallet are connected
  if (!user?._id) {
    toast("You must be logged in to submit a proposal");
    return;
  }
  if (!signer) {
    toast("Please connect your wallet");
    return;
  }

  let escrowAddress = "";

  try {
    // Step 1: Deploy escrow contract (optional, if needed)
    const signerAddress = await signer.getAddress();
    const contractFactory = new ethers.ContractFactory(EscrowABI.abi, EscrowABI.bytecode, signer);

    const ethValue = ethers.parseEther(proposedBudget.toString()); // Assuming input is in ETH
    const contract = await contractFactory.deploy(signerAddress, {
      value: ethValue,
    });
    await contract.deployed();
    escrowAddress = contract.address;

    console.log("✅ Escrow contract deployed at:", escrowAddress);
  } catch (err: any) {
    console.error("⛔ Escrow deploy error:", err.message);
    toast(`Contract deployment failed: ${err.message}`);
    return;
  }

  try {
    // Step 2: Submit proposal to backend
    const proposalPayload = {
      gigId: id,
      userId: user._id,
      coverLetter,
      proposedBudget,
      deliveryTime,
      escrowAddress,
    };

    await axios.post("http://localhost:8080/api/proposals", proposalPayload);
    toast("Proposal submitted successfully!");
    navigate(`/gig/${id}`);
  } catch (err) {
    console.error("⛔ Proposal submission failed:", err);
    toast("Error submitting proposal to backend");
  }
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
                  <label className="block text-sm font-medium mb-2">Proposed Budget (in ETH)</label>
                  <p className="text-xs text-muted-foreground mt-1">e.g. 0.01 ETH = ~$35 USD</p>
                  <Input
                    type="number"
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(e.target.value)}
                    placeholder={`${gig.budget?.min ?? ''} - ${gig.budget?.max ?? ''}`}
                    required
                    min={gig.budget?.min}
                    max={gig.budget?.max}
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
                    min={1}
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
