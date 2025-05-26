
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/contexts/Web3Context';
import { Home, Briefcase, Calendar, Users, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const location = useLocation();
  const { account, isConnected, isConnecting, connect, disconnect } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/freelance', label: 'Find Work', icon: Briefcase },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              SparkVerse
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50 shadow-sm'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Web3 Connection & Mobile Menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-2 md:space-x-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs md:text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 md:mr-2"></div>
                  <span className="hidden sm:inline">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
                  <span className="sm:hidden">Connected</span>
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={disconnect}
                  className="hidden md:flex hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button 
                onClick={connect} 
                disabled={isConnecting}
                size="sm"
                className="bg-primary-600 hover:bg-primary-700 text-xs md:text-sm px-2 md:px-4"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Web3 Actions */}
              {isConnected && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={disconnect}
                    className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
