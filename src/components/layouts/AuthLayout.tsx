
import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { LogOut, User, Settings, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { user, profile, signOut } = useAuthStore();
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
      case 'super_admin': return 'Super Admin';
      case 'bakery_admin': return 'Bakeri Admin';
      case 'bakery_user': return 'Bakeri Bruker';
      default: return 'Bruker';
    }
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Ordrer & Pakking', href: '/dashboard/orders' },
    { name: 'Leveranser', href: '/dashboard/deliveries' },
    { name: 'Kunder', href: '/dashboard/customers' },
    { name: 'Rapporter', href: '/dashboard/reports' },
  ];

  // Add Admin for super_admin only
  if (profile?.role === 'super_admin') {
    navigationItems.push({ name: 'Admin', href: '/dashboard/admin' });
  }

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/3406f920-0e02-4d94-ae46-754d24d13db4.png" 
                alt="Loaf & Load"
                className="h-10 w-auto"
              />
              <span className="ml-3 text-xl font-semibold text-bakery-brown">
                Loaf & Load
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActiveRoute(item.href)
                      ? "text-primary border-b-2 border-primary pb-4"
                      : "text-gray-700 hover:text-gray-900"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button + User menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* User info (hidden on mobile) */}
              {profile && (
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium text-gray-900">
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
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ''} alt={profile?.name || ''} />
                      <AvatarFallback>
                        {getInitials(profile?.name || user?.email || '')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.name || 'Ukjent bruker'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Innstillinger</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logg ut</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "block px-3 py-2 text-base font-medium rounded-md transition-colors",
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
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
