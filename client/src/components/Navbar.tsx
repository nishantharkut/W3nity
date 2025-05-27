// import { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from '@/components/ui/navigation-menu';
// import { useAuthState } from '@/hooks/useAuth';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//   Menu,
//   X,
//   Zap,
//   User,
//   Settings,
//   LogOut,
//   LayoutDashboard,
//   Briefcase,
//   Calendar,
//   Users,
//   Bell
// } from 'lucide-react';

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const { isAuthenticated, user, logout } = useAuthState();
//   const location = useLocation();

//   const navigationItems = [
//     { name: 'Freelance', href: '/freelance', icon: Briefcase },
//     { name: 'Events', href: '/events', icon: Calendar },
//     { name: 'Community', href: '/community', icon: Users },
//   ];

//   const handleLogout = () => {
//     logout();
//     setIsMobileMenuOpen(false);
//   };

//   const isActivePath = (path: string) => {
//     return location.pathname === path;
//   };

//   return (
//     <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
//             <div className="flex items-center justify-center w-8 h-8 bg-gradient-spark rounded-lg">
//               <Zap className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xl font-bold text-gradient">SparkVerse</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <NavigationMenu>
//               <NavigationMenuList>
//                 {navigationItems.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <NavigationMenuItem key={item.name}>
//                       <NavigationMenuLink asChild>
//                         <Link
//                           to={item.href}
//                           className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
//                             isActivePath(item.href) ? 'bg-accent text-accent-foreground' : ''
//                           }`}
//                         >
//                           <Icon className="w-4 h-4 mr-2" />
//                           {item.name}
//                         </Link>
//                       </NavigationMenuLink>
//                     </NavigationMenuItem>
//                   );
//                 })}
//               </NavigationMenuList>
//             </NavigationMenu>
//           </div>

//           {/* User Menu / Auth Buttons */}
//           <div className="flex items-center space-x-4">
//             {isAuthenticated && user ? (
//               <div className="hidden md:flex items-center space-x-4">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="relative"
//                 >
//                   <Bell className="w-5 h-5" />
//                   <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
//                 </Button>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="relative h-10 w-10 rounded-full">
//                       <Avatar className="h-10 w-10">
//                         <AvatarImage src={user.avatar} />
//                         <AvatarFallback className="bg-gradient-spark text-white">
//                           {user.username.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-56 bg-background border border-border" align="end">
//                     <div className="flex items-center justify-start gap-2 p-2">
//                       <div className="flex flex-col space-y-1 leading-none">
//                         <p className="font-medium">{user.username}</p>
//                         <p className="text-xs text-muted-foreground">{user.email}</p>
//                       </div>
//                     </div>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem asChild>
//                       <Link to="/dashboard" className="flex items-center">
//                         <LayoutDashboard className="mr-2 h-4 w-4" />
//                         Dashboard
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link to="/profile" className="flex items-center">
//                         <User className="mr-2 h-4 w-4" />
//                         Profile
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <Settings className="mr-2 h-4 w-4" />
//                       Settings
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={handleLogout} className="text-red-600">
//                       <LogOut className="mr-2 h-4 w-4" />
//                       Log out
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             ) : (
//               <div className="hidden md:flex items-center space-x-2">
//                 <Button variant="ghost" asChild>
//                   <Link to="/login">Log In</Link>
//                 </Button>
//                 <Button className="glow-button" asChild>
//                   <Link to="/register">Sign Up</Link>
//                 </Button>
//               </div>
//             )}

//             {/* Mobile Menu Button */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             >
//               {isMobileMenuOpen ? (
//                 <X className="h-6 w-6" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
//             <div className="px-2 py-4 space-y-2">
//               {navigationItems.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
//                       isActivePath(item.href) ? 'bg-accent text-accent-foreground' : ''
//                     }`}
//                   >
//                     <Icon className="w-4 h-4 mr-3" />
//                     {item.name}
//                   </Link>
//                 );
//               })}

//               {isAuthenticated && user ? (
//                 <>
//                   <div className="border-t border-border/40 my-2 pt-2">
//                     <Link
//                       to="/dashboard"
//                       onClick={() => setIsMobileMenuOpen(false)}
//                       className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
//                     >
//                       <LayoutDashboard className="w-4 h-4 mr-3" />
//                       Dashboard
//                     </Link>
//                     <Link
//                       to="/profile"
//                       onClick={() => setIsMobileMenuOpen(false)}
//                       className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
//                     >
//                       <User className="w-4 h-4 mr-3" />
//                       Profile
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-red-600"
//                     >
//                       <LogOut className="w-4 h-4 mr-3" />
//                       Log out
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <div className="border-t border-border/40 my-2 pt-2 space-y-2">
//                   <Button variant="ghost" className="w-full justify-start" asChild>
//                     <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
//                       Log In
//                     </Link>
//                   </Button>
//                   <Button className="w-full glow-button" asChild>
//                     <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
//                       Sign Up
//                     </Link>
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuthState } from "@/hooks/useAuth";
import { useWeb3 } from "@/hooks/useWeb3";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  Zap,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Briefcase,
  Calendar,
  Users,
  Bell,
} from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthState();
  const { account, connectWallet } = useWeb3();
  const location = useLocation();

  const navigationItems = [
    { name: "Freelance", href: "/freelance", icon: Briefcase },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Community", href: "/community", icon: Users },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const WalletButton = () => (
    <Button variant="outline" onClick={connectWallet}>
      {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
    </Button>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-spark rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">SparkVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavigationMenuItem key={item.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.href}
                          className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                            isActivePath(item.href)
                              ? "bg-accent text-accent-foreground"
                              : ""
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {item.name}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Wallet Button */}
            <div className="hidden md:block">
              <WalletButton />
            </div>

            {isAuthenticated && user ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/notifications">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-spark text-white">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-background border border-border"
                    align="end"
                  >
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button className="glow-button" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
            <div className="px-2 py-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isActivePath(item.href)
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Wallet Button Mobile */}
              <div className="pt-2">
                <WalletButton />
              </div>

              {isAuthenticated && user ? (
                <div className="border-t border-border/40 my-2 pt-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-3" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="border-t border-border/40 my-2 pt-2 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log In
                    </Link>
                  </Button>
                  <Button className="w-full glow-button" asChild>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
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
