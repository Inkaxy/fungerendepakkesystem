
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Users, Building2, Package, ShoppingCart } from 'lucide-react';

interface User {
  id: string;
  name?: string;
  email?: string;
  role: string;
  is_active: boolean;
  bakery?: { name: string };
}

interface UserPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const UserPermissionsDialog = ({ open, onOpenChange, user }: UserPermissionsDialogProps) => {
  const getPermissions = (role: string) => {
    switch (role) {
      case 'super_admin':
        return {
          viewAllBakeries: true,
          manageBakeries: true,
          manageUsers: true,
          viewCustomers: true,
          manageCustomers: true,
          viewProducts: true,
          manageProducts: true,
          viewOrders: true,
          manageOrders: true,
          viewReports: true,
          manageSystem: true,
        };
      case 'bakery_admin':
        return {
          viewAllBakeries: false,
          manageBakeries: false,
          manageUsers: true,
          viewCustomers: true,
          manageCustomers: true,
          viewProducts: true,
          manageProducts: true,
          viewOrders: true,
          manageOrders: true,
          viewReports: true,
          manageSystem: false,
        };
      case 'bakery_user':
        return {
          viewAllBakeries: false,
          manageBakeries: false,
          manageUsers: false,
          viewCustomers: true,
          manageCustomers: false,
          viewProducts: true,
          manageProducts: false,
          viewOrders: true,
          manageOrders: false,
          viewReports: false,
          manageSystem: false,
        };
      default:
        return {};
    }
  };

  const permissions = user ? getPermissions(user.role) : {};

  const PermissionItem = ({ label, hasPermission, icon: Icon }: { label: string; hasPermission: boolean; icon: any }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-sm">{label}</span>
      </div>
      {hasPermission ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
    </div>
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge variant="destructive">Super Admin</Badge>;
      case 'bakery_admin':
        return <Badge variant="default">Bakeri Admin</Badge>;
      case 'bakery_user':
        return <Badge variant="secondary">Bakeri Bruker</Badge>;
      default:
        return <Badge variant="outline">Ukjent</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tilganger for {user?.name || user?.email}</DialogTitle>
          <DialogDescription>
            Oversikt over brukerens tilganger basert på rolle og bakeri-tilknytning.
          </DialogDescription>
        </DialogHeader>
        
        {user && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium">{user.name || 'Navn ikke satt'}</span>
                  {getRoleBadge(user.role)}
                </div>
                <p className="text-sm text-gray-600">{user.email}</p>
                {user.bakery && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Building2 className="w-3 h-3" />
                    <span className="text-xs text-gray-500">Bakeri: {user.bakery.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">System Tilganger</h4>
              <div className="space-y-1">
                <PermissionItem 
                  label="Se alle bakerier" 
                  hasPermission={permissions.viewAllBakeries} 
                  icon={Building2}
                />
                <PermissionItem 
                  label="Administrere bakerier" 
                  hasPermission={permissions.manageBakeries} 
                  icon={Building2}
                />
                <PermissionItem 
                  label="Administrere brukere" 
                  hasPermission={permissions.manageUsers} 
                  icon={Users}
                />
                <PermissionItem 
                  label="System administrasjon" 
                  hasPermission={permissions.manageSystem} 
                  icon={Users}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Bakeri Tilganger</h4>
              <div className="space-y-1">
                <PermissionItem 
                  label="Se kunder" 
                  hasPermission={permissions.viewCustomers} 
                  icon={Users}
                />
                <PermissionItem 
                  label="Administrere kunder" 
                  hasPermission={permissions.manageCustomers} 
                  icon={Users}
                />
                <PermissionItem 
                  label="Se produkter" 
                  hasPermission={permissions.viewProducts} 
                  icon={Package}
                />
                <PermissionItem 
                  label="Administrere produkter" 
                  hasPermission={permissions.manageProducts} 
                  icon={Package}
                />
                <PermissionItem 
                  label="Se ordrer" 
                  hasPermission={permissions.viewOrders} 
                  icon={ShoppingCart}
                />
                <PermissionItem 
                  label="Administrere ordrer" 
                  hasPermission={permissions.manageOrders} 
                  icon={ShoppingCart}
                />
                <PermissionItem 
                  label="Se rapporter" 
                  hasPermission={permissions.viewReports} 
                  icon={Users}
                />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;
