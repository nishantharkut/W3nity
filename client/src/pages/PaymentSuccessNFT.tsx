import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft } from "lucide-react";

const PaymentSuccessNFT = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Assume tokenURI is passed as query param from mint success redirect
  const tokenURI = searchParams.get("tokenURI") || "";
  console.log(tokenURI)
  const eventId = searchParams.get("eventId"); // example additional param

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
            Ticket Minted Successfully!
          </CardTitle>
          <p className="text-muted-foreground">
            Your NFT ticket has been minted. Check your wallet or view the event below.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {tokenURI ? (
            <>
              <img
                src={tokenURI}
                alt="NFT Ticket"
                className="mx-auto rounded-md w-full max-w-xs"
              />
              <p className="text-xs break-words mt-2">{tokenURI}</p>
            </>
          ) : (
            <p className="text-muted-foreground">No ticket image available.</p>
          )}

          {eventId && (
            <Button
              onClick={() => navigate(`/event/${eventId}`)}
              className="w-full"
            >
              View Event Details
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessNFT;
