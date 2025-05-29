import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, ArrowLeft, Clock } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

interface PaymentData {
  id: string;
  paymentType: string;
  referenceId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  stripeSessionId?: string;
  transactionHash?: string;
  blockNumber?: number;
  walletAddress?: string;
  metadata: any;
  createdAt: string;
}

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const paymentId = searchParams.get("payment_id");
//   console.log(paymentId);

  useEffect(() => {
    if (paymentId) {
      loadPaymentDetails();
    } else {
      setIsLoading(false);
    }
  }, [paymentId]);

  const loadPaymentDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/payments/${paymentId}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch payment details: ${response.statusText}`
        );
      }

      const data: PaymentData = await response.json();
      setPayment(data);
      console.log(data)

      if (
        data.status === "pending" &&
        data.paymentMethod === "stripe" &&
        data.stripeSessionId

      ) {
        await verifyStripePayment(data.stripeSessionId
        );
      }
    } catch (error: any) {
      console.error("Error loading payment:", error);
      toast({
        title: "Error",
        description: "Failed to load payment details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyStripePayment = async (sessionId: string) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/payments/verify-stripe-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id: sessionId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to verify payment: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === "completed") {
        setPayment((prev) => (prev ? { ...prev, status: "completed" } : null));
        toast({
          title: "Payment Confirmed!",
          description: "Your payment has been successfully processed.",
        });
      }
    } catch (error: any) {
      console.error("Error verifying payment:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "processing":
        return <Badge variant="outline">Processing</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActionButton = () => {
    if (!payment) return null;

    if (payment.paymentType === "event_ticket") {
      return (
        <Button
          onClick={() => navigate(`/event/${payment.referenceId}`)}
          className="w-full"
        >
          View Event Details
        </Button>
      );
    } else if (payment.paymentType === "gig_payout") {
      return (
        <Button
          onClick={() => navigate(`/gig/${payment.referenceId}`)}
          className="w-full"
        >
          View Gig Details
        </Button>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-center py-12">
          <Clock className="w-8 h-8 animate-spin mr-3" />
          <span>Loading payment details...</span>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Payment Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the payment details you're looking for.
            </p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="outline" onClick={() => navigate("/")} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <Card className="glass-effect">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">
            {payment.status === "completed"
              ? "Payment Successful!"
              : "Payment Received"}
          </CardTitle>
          <p className="text-muted-foreground">
            {payment.metadata?.title || "Your payment has been processed"}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount:</span>
              <span className="text-2xl font-bold text-gradient">
                ${payment.amount.toFixed(2)} {payment.currency}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status:</span>
              {getStatusBadge(payment.status)}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment Method:</span>
              <Badge variant="outline" className="capitalize">
                {payment.paymentMethod}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Type:</span>
              <Badge variant="secondary" className="capitalize">
                {payment.paymentType
                  ? payment.paymentType.replace("_", " ")
                  : ""}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date:</span>
              <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Transaction Details */}
            {payment.paymentMethod === "stripe" &&
              payment.stripeSessionId && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Stripe Details</h4>
                  <div className="text-sm text-muted-foreground">
                    Session ID: {payment.stripeSessionId}
                  </div>
                </div>
              )}

            {payment.paymentMethod === "web3" && payment.transactionHash && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Blockchain Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Transaction Hash:
                    </span>
                    <div className="flex items-center">
                      <span className="font-mono">
                        {payment.transactionHash.slice(0, 10)}...
                        {payment.transactionHash.slice(-8)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://etherscan.io/tx/${payment.transactionHash}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {payment.blockNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Block Number:
                      </span>
                      <span className="font-mono">
                        {payment.blockNumber.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {payment.walletAddress && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wallet:</span>
                      <span className="font-mono">
                        {payment.walletAddress.slice(0, 6)}...
                        {payment.walletAddress.slice(-4)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          {getActionButton()}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
