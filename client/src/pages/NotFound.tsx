import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gradient opacity-20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-16 h-16 text-muted-foreground animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Oops! The page you're looking for seems to have vanished into the digital void.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="glow-button">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-12 p-6 bg-gradient-dark rounded-lg border border-border/50">
          <h3 className="font-semibold mb-2">Popular Destinations</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/freelance" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Freelance Gigs
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/events" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Tech Events
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/community" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Community
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/dashboard" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;