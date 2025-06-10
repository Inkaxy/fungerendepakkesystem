
import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { LogOut, User, Settings, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children
}) => {
  const {
    user,
    profile,
    signOut
  } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    toast.success('Du er nå logget ut');
  };
  
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const getRoleName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'bakery_admin':
        return 'Bakeri Admin';
      case 'bakery_user':
        return 'Bakeri Bruker';
      default:
        return 'Bruker';
    }
  };
  
  const navigationItems = [{
    name: 'Dashboard',
    href: '/dashboard'
  }, {
    name: 'Ordrer & Pakking',
    href: '/dashboard/orders'
  }, {
    name: 'Leveranser',
    href: '/dashboard/deliveries'
  }, {
    name: 'Produkter',
    href: '/dashboard/products'
  }, {
    name: 'Kunder',
    href: '/dashboard/customers'
  }, {
    name: 'Rapporter',
    href: '/dashboard/reports'
  }, {
    name: 'Display Innstillinger',
    href: '/dashboard/display-settings'
  }];

  // Add Admin for super_admin only
  if (profile?.role === 'super_admin') {
    navigationItems.push({
      name: 'Admin',
      href: '/dashboard/admin'
    });
  }
  
  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <img 
                src="/lovable-uploads/3406f920-0e02-4d94-ae46-754d24d13db4.png" 
                alt="Logo" 
                className="h-16 w-auto object-contain" 
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map(item => (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100",
                    isActiveRoute(item.href) 
                      ? "text-primary bg-primary/10 border border-primary/20" 
                      : "text-gray-700 hover:text-gray-900"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Button 
                variant="ghost" 
                size="sm"
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* User info (hidden on mobile) */}
              {profile && (
                <div className="hidden md:flex flex-col items-end text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {profile.name || 'Ukjent bruker'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getRoleName(profile.role)}
                    {profile.bakery_name && ` • ${profile.bakery_name}`}
                  </div>
                </div>
              )}

              {/* User dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-gray-200 hover:ring-primary/50 transition-all">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url || ''} alt={profile?.name || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(profile?.name || user?.email || '')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-semibold leading-none">
                        {profile?.name || 'Ukjent bruker'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-primary font-medium">
                        {getRoleName(profile?.role || '')}
                        {profile?.bakery_name && ` • ${profile.bakery_name}`}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Innstillinger</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logg ut</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {navigationItems.map(item => (
                  <Link 
                    key={item.name} 
                    to={item.href} 
                    className={cn(
                      "block px-4 py-3 text-base font-medium rounded-lg transition-all",
                      isActiveRoute(item.href) 
                        ? "bg-primary text-primary-foreground" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
