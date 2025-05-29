import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';

const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    if (!paymentId) return;

    const updatePaymentStatus = async () => {
      setIsUpdating(true);
      setError(null);

      try {
        const response = await fetch(`/api/payments/${paymentId}/cancel`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update payment status');
        }
      } catch (err: any) {
        console.error('Error updating payment status:', err);
        setError(err.message || 'Something went wrong. Please try again later.');
      } finally {
        setIsUpdating(false);
      }
    };

    updatePaymentStatus();
  }, [paymentId]);

  const handleRetryPayment = () => {
    if (paymentId) {
      navigate(`/payment?payment_id=${paymentId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button 
        variant="outline" 
        onClick={() => navigate('/')}
        className="mb-6"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <Card className="glass-effect">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-800">Payment Cancelled</CardTitle>
          <p className="text-muted-foreground">
            Your payment was cancelled and no charges were made
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              Don't worry! Your payment was not processed and you haven't been charged. 
              You can try again anytime.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-center">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleRetryPayment}
              className="w-full glow-button"
              disabled={isUpdating}
              aria-label="Try payment again"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Payment Again
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="w-full"
              aria-label="Go to dashboard"
            >
              Go to Dashboard
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help? <a href="mailto:support@example.com" className="text-primary hover:underline">Contact Support</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelPage;
