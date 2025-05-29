
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet } from 'lucide-react';

interface PaymentButtonProps {
  type: 'event_ticket' | 'gig_payout';
  itemId: string;
  amount: number;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  paymentMethod?: 'stripe' | 'web3' | 'both';
}

const PaymentButton = ({ 
  type, 
  itemId, 
  amount, 
  disabled = false, 
  className = "", 
  children,
  paymentMethod = 'both'
}: PaymentButtonProps) => {
  const navigate = useNavigate();

  const handlePayment = () => {
    const searchParams = new URLSearchParams();
    if (type === 'gig_payout') {
      searchParams.set('amount', amount.toString());
    }
    
    const url = `/payment/${type}/${itemId}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    navigate(url);
  };

  const getButtonText = () => {
    if (children) return children;
    
    switch (type) {
      case 'event_ticket':
        return amount > 0 ? `Buy Ticket - $${amount}` : 'Register for Free';
      case 'gig_payout':
        return `Receive Payment - $${amount}`;
      default:
        return 'Pay Now';
    }
  };

  const getIcon = () => {
    if (paymentMethod === 'stripe') return <CreditCard className="w-4 h-4 mr-2" />;
    if (paymentMethod === 'web3') return <Wallet className="w-4 h-4 mr-2" />;
    return <CreditCard className="w-4 h-4 mr-2" />;
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled}
      className={`glow-button ${className}`}
    >
      {getIcon()}
      {getButtonText()}
    </Button>
  );
};

export default PaymentButton;