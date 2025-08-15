import React, { useState, useEffect } from "react";
import { InlineLoader } from '@/components/ui/spinner'
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/hooks/useWeb3";
import {
  CreditCard,
  Wallet,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuthState } from "@/hooks/useAuth";
import { loadStripe } from "@stripe/stripe-js";
import MintTicket from "@/components/MintTicket";
import { ethers } from "ethers";

const stripePromise = loadStripe("pk_test_51RU0hJE0K41hd9Mhi0idT7iShHiO0Os0dCrqoA943LKGDGR0uZzIMu70KUzsX9ZyINoohvXfNf9uPXA0An7Pg7z30016cxgAYZ");

type PaymentType = "event_ticket" | "gig_payout";

interface PaymentDetails {
  type: PaymentType;
  item: any;
  amount: number;
  currency: string;
  title: string;
  description: string;
}

const fallbackURIs = [
  "https://gateway.pinata.cloud/ipfs/bafkreihnjgyvumz6ptvvlny4fj4ua7dawzhlxpi7ue6lfcfaxfg7btps5a",
  "https://gateway.pinata.cloud/ipfs/bafkreifg6ud6wtmjs3fgsmaz3begz7czugsihknaptjddr5f5vucjncb3a",
  "https://gateway.pinata.cloud/ipfs/bafkreigbkuyoj3gwmypzw3ibnj3ncy3ueqacetsytylfd7uixubw2o6mge",
  "https://gateway.pinata.cloud/ipfs/bafkreihvgxyvqyf4wyfp75z36uysicjsucajfomznq57haw7y2gip45b6i",
];

const PaymentPage = () => {
  const { user, isAuthenticated } = useAuthState();
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { connect, isConnected, account, balance } = useWeb3();

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [isProcessingWeb3, setIsProcessingWeb3] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");

  const [event, setEvent] = useState<any>(null);
  const [userWallet, setUserWallet] = useState<string | null>(null);
  const [userTickets, setUserTickets] = useState<any[]>([]);
  const [alreadyMinted, setAlreadyMinted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tokenURI =
    fallbackURIs[parseInt(id || "0")] || `https://gateway.pinata.cloud/ipfs/dynamic-event-${id}`;

  const fetchEvent = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}`);
      if (!res.ok) throw new Error("Failed to fetch event.");
      const data = await res.json();
      setEvent(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Event not found.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletAndTickets = async () => {
    try {
      if (!window.ethereum || !id) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const wallet = await signer.getAddress();
      setUserWallet(wallet);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${wallet}`);
      const data = await res.json();
      setUserTickets(data);

      const isMinted = data.some((t: any) => t.tokenURI.includes(id));
      setAlreadyMinted(isMinted);
    } catch (err) {
      console.error("Failed to fetch wallet/tickets:", err);
    }
  };

  const loadPaymentDetails = async () => {
    if (!type || !id) return;

    try {
      if (type === "event_ticket") {
        const { data: event } = await axios.get(`${import.meta.env.VITE_API_URL}/api/events/${id}`);
        setPaymentDetails({
          type: "event_ticket",
          item: event,
          amount: event.price,
          currency: "USD",
          title: `Event Ticket: ${event.title}`,
          description: `Purchase ticket for ${event.title}`,
        });
      } else if (type === "gig_payout") {
        const { data: gig } = await axios.get(`${import.meta.env.VITE_API_URL}/api/gigs/${id}`);
        const amount = searchParams.get("amount") || "0";
        setPaymentDetails({
          type: "gig_payout",
          item: gig,
          amount: parseFloat(amount),
          currency: "USD",
          title: `Gig Payout: ${gig.title}`,
          description: `Receive payment for completed gig: ${gig.title}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error fetching details",
        description: "Could not fetch payment data",
        variant: "destructive",
      });
    }
  };

  const createPaymentRecord = async (method: "stripe" | "web3", additionalData = {}) => {
    const res = await axios.post(`/api/payments`, {
      userId: user._id,
      paymentType: paymentDetails?.type,
      referenceId: paymentDetails?.item._id,
      amount: paymentDetails?.amount,
      currency: paymentDetails?.currency,
      paymentMethod: method,
      metadata: {
        title: paymentDetails?.title,
        description: paymentDetails?.description,
        ...additionalData,
      },
    });
    return res.data;
  };

  const updatePaymentStatus = async (paymentId: string, status: string, additionalData = {}) => {
    await axios.put(`/api/payments/${paymentId}`, {
      status,
      ...additionalData,
    });
  };

  const handleStripePayment = async () => {
    if (!paymentDetails || !user) return;

    setIsProcessingStripe(true);
    setPaymentStatus("processing");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-stripe-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          paymentType: paymentDetails.type,
          referenceId: paymentDetails.item._id,
          metadata: {
            title: paymentDetails.title,
            description: paymentDetails.description,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.id) throw new Error(data.error || "Failed to create checkout session");

      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({ sessionId: data.id });

      if (result.error) throw new Error(result.error.message);
    } catch (error: any) {
      console.error("Stripe payment error:", error);
      setPaymentStatus("failed");
      toast({
        title: "Payment Failed",
        description: error.message || "Could not initiate payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingStripe(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    fetchWalletAndTickets();
  }, [id]);

  useEffect(() => {
    loadPaymentDetails();
  }, [type, id]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {loading ? (
        <div className="text-center mt-10">
          <InlineLoader message="Loading event..." variant="faded" size="lg" />
        </div>
      ) : error || !event ? (
        <div className="text-center mt-10">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => navigate("/events")}>Back to Events</Button>
        </div>
      ) : !paymentDetails ? (
        <div className="text-center mt-10">
          <h1 className="text-2xl font-bold mb-4">Payment not found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      ) : (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payment Details</span>
              <Badge variant={paymentDetails.type === "event_ticket" ? "default" : "secondary"}>
                {paymentDetails.type === "event_ticket" ? "Event Ticket" : "Gig Payout"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">{paymentDetails.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{paymentDetails.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount:</span>
                <span className="text-2xl font-bold text-gradient">
                  ${paymentDetails.amount.toFixed(2)} {paymentDetails.currency}
                </span>
              </div>
            </div>

            <Separator />

            {paymentStatus !== "idle" && (
              <div className="flex items-center justify-center p-4 rounded-lg border">
                {paymentStatus === "processing" && (
                  <>
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    <span>Processing payment...</span>
                  </>
                )}
                {paymentStatus === "success" && (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    <span className="text-green-700">Payment successful!</span>
                  </>
                )}
                {paymentStatus === "failed" && (
                  <>
                    <XCircle className="w-5 h-5 mr-2 text-red-500" />
                    <span className="text-red-700">Payment failed. Please try again.</span>
                  </>
                )}
              </div>
            )}

            {paymentStatus === "idle" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Choose Payment Method</h3>
                <Button
                  onClick={handleStripePayment}
                  disabled={isProcessingStripe || isProcessingWeb3}
                  className="w-full h-16 glow-button"
                  size="lg"
                >
                  {isProcessingStripe ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay with Credit Card (Stripe)
                    </>
                  )}
                </Button>

                {alreadyMinted ? (
                  <Card className="border border-green-500 bg-green-900/20 text-green-300 text-sm p-4">
                    <div className="mb-2 font-bold">🎟️ Ticket Already Minted!</div>
                    <img src={tokenURI} alt="NFT Ticket" className="rounded-md w-full max-w-xs" />
                    <p className="mt-2 break-words text-xs">{tokenURI}</p>
                  </Card>
                ) : (
                  <MintTicket
                    tokenURI={tokenURI}
                    onMintSuccess={() => {
                      toast({
                        title: "Ticket Minted!",
                        description: "Check your wallet.",
                      });
                      fetchWalletAndTickets();
                      setTimeout(() => {
                        navigate(`/NFTpayment/success?tokenURI=${encodeURIComponent(tokenURI)}&eventId=${id}`);
                      }, 2000);
                    }}
                  />
                )}

                {isConnected && (
                  <div className="text-xs text-muted-foreground text-center">
                    Wallet Balance: {balance} ETH
                  </div>
                )}
              </div>
            )}

            {paymentStatus === "failed" && (
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    setPaymentStatus("idle");
                    setIsProcessingStripe(false);
                    setIsProcessingWeb3(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentPage;
