import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { ArrowLeft, Mail, KeyRound } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Password reset request for:', email);

    toast.success('Password reset link sent successfully!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 ">
      <div className="text-center max-w-md w-full mx-auto p-8 border border-border rounded-xl shadow-lg bg-card">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
           <KeyRound className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold mb-3 text-foreground">Forgot Your Password?</h1>
        <p className="text-muted-foreground mb-8">
          No worries! Enter your email address below and we'll send you a link to reset your password.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 h-12" 
            />
          </div>
          <Button type="submit" className="w-full h-12 text-lg glow-button">
            Send Reset Link
          </Button>
        </form>
        
        <div className="mt-8">
          <Button variant="ghost" asChild>
            <a href="/login">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;



