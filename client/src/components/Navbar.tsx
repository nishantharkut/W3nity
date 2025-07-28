import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/useAuth';
import { useWeb3 } from '@/hooks/useWeb3';
import GlobalSearch from '@/components/GlobalSearch';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  X,
  Zap,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Briefcase,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Freelance', href: '/freelance', icon: Briefcase },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Community', href: '/community', icon: Users },
];

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user, logout } = useAuthState();
  const { account, connect, isConnected } = useWeb3();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setWalletAddress(account || null);
  }, [account]);

  useEffect(() => {
    if (isAuthenticated && user) {
      toast({ title: 'Welcome back!', description: `Hello, ${user.username}` });
    }
  }, [isAuthenticated, user, toast]);
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged out', description: 'You have been signed out.' });
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleWallet = () => {
    if (!walletAddress) {
      connect();
      toast({ title: 'Connecting Wallet', description: 'Please authorize the connection.' });
    } else {
      toast({ title: 'Wallet Connected', description: `Connected to ${walletAddress}` });
    }
  };

  const WalletButton = () => (
    <Button variant={walletAddress ? 'default' : 'outline'} size="sm" onClick={handleWallet}>
      <span className="mr-2">💰</span>
      {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
    </Button>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}

           <div className="pl-1 sm:pl-14">
             <Logo variant="navbar" height="h-24" />
           </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navigationItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition ${isActive(item.href) ? 'bg-accent text-accent-foreground' : ''
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>


            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <Button variant="outline" size="icon" onClick={() => { setIsSearchOpen(true); toast({ title: 'Search', description: 'Looking for something?' }); }}>
                <Search className="w-4 h-4" />
              </Button>

              {/* Wallet */}
              <div className="hidden md:block">
                <WalletButton />
              </div>

              {/* Notifications */}
              {isAuthenticated && (
                <Button variant="outline" size="icon" onClick={() => { navigate('/notifications'); toast({ title: 'Notifications', description: 'Viewing notifications' }); }} className="relative">
                  <Bell className="w-4 h-4" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500">{/* dynamic count */}</Badge>
                </Button>
              )}

              {/* User Menu */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="p-2">
                      <p className="font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" onClick={() => toast({ title: 'Dashboard', description: 'Going to dashboard' })}>
                        <LayoutDashboard className="mr-2 w-4 h-4" />Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" onClick={() => toast({ title: 'Profile', description: 'Viewing profile' })}>
                        <User className="mr-2 w-4 h-4" />Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" onClick={() => toast({ title: 'Settings', description: 'Adjusting settings' })}>
                        <Settings className="mr-2 w-4 h-4" />Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 w-4 h-4" />Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex space-x-2">
                  <Button variant="ghost" asChild>
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-background/95 backdrop-blur-sm">
              <div className="py-4 space-y-2">
                {navigationItems.map(item => (
                  <Button key={item.href} variant={isActive(item.href) ? 'default' : 'ghost'} asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to={item.href} className="flex items-center space-x-2 w-full">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                ))}
                <div className="pt-2 space-y-2">
                  <WalletButton />
                  {isAuthenticated && (
                    <>
                      <Button variant="ghost" asChild onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); toast({ title: 'Profile' }); }}>
                        <Link to="/profile" className="flex items-center space-x-2 w-full">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); toast({ title: 'Settings' }); }}>
                        <Link to="/settings" className="flex items-center space-x-2 w-full">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-600">
                        <LogOut className="w-4 h-4 mr-2" /> Log out
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
