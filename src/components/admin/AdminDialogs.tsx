
import React from 'react';
import CreateBakeryDialog from '@/components/admin/CreateBakeryDialog';
import EditBakeryDialog from '@/components/admin/EditBakeryDialog';
import ViewUsersDialog from '@/components/admin/ViewUsersDialog';
import CreateUserDialog from '@/components/admin/CreateUserDialog';
import EditUserDialog from '@/components/admin/EditUserDialog';
import UserPermissionsDialog from '@/components/admin/UserPermissionsDialog';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import DeleteAllDataDialog from '@/components/admin/DeleteAllDataDialog';

interface Bakery {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface User {
  id: string;
  name?: string;
  email?: string;
  role: string;
  bakery_id?: string;
  is_active: boolean;
  bakery?: { name: string };
}

interface AdminDialogsProps {
  showCreateBakery: boolean;
  setShowCreateBakery: (show: boolean) => void;
  editingBakery: Bakery | null;
  setEditingBakery: (bakery: Bakery | null) => void;
  viewingBakeryUsers: Bakery | null;
  setViewingBakeryUsers: (bakery: Bakery | null) => void;
  showCreateUser: boolean;
  setShowCreateUser: (show: boolean) => void;
  editingUser: User | null;
  setEditingUser: (user: User | null) => void;
  managingUserPermissions: User | null;
  setManagingUserPermissions: (user: User | null) => void;
  deletingBakery: Bakery | null;
  setDeletingBakery: (bakery: Bakery | null) => void;
  deactivatingUser: User | null;
  setDeactivatingUser: (user: User | null) => void;
  reactivatingUser: User | null;
  setReactivatingUser: (user: User | null) => void;
  permanentDeletingUser: User | null;
  setPermanentDeletingUser: (user: User | null) => void;
  showDeleteAllData: boolean;
  setShowDeleteAllData: (show: boolean) => void;
  onDeleteBakery: () => void;
  onDeactivateUser: () => void;
  onReactivateUser: () => void;
  onPermanentDeleteUser: () => void;
  deleteBakeryLoading: boolean;
  deactivateUserLoading: boolean;
  reactivateUserLoading: boolean;
  permanentDeleteUserLoading: boolean;
}

const AdminDialogs = ({
  showCreateBakery,
  setShowCreateBakery,
  editingBakery,
  setEditingBakery,
  viewingBakeryUsers,
  setViewingBakeryUsers,
  showCreateUser,
  setShowCreateUser,
  editingUser,
  setEditingUser,
  managingUserPermissions,
  setManagingUserPermissions,
  deletingBakery,
  setDeletingBakery,
  deactivatingUser,
  setDeactivatingUser,
  reactivatingUser,
  setReactivatingUser,
  permanentDeletingUser,
  setPermanentDeletingUser,
  showDeleteAllData,
  setShowDeleteAllData,
  onDeleteBakery,
  onDeactivateUser,
  onReactivateUser,
  onPermanentDeleteUser,
  deleteBakeryLoading,
  deactivateUserLoading,
  reactivateUserLoading,
  permanentDeleteUserLoading,
}: AdminDialogsProps) => {
  return (
    <>
      <CreateBakeryDialog 
        open={showCreateBakery} 
        onOpenChange={setShowCreateBakery} 
      />
      <EditBakeryDialog
        open={!!editingBakery}
        onOpenChange={(open) => !open && setEditingBakery(null)}
        bakery={editingBakery}
      />
      <ViewUsersDialog
        open={!!viewingBakeryUsers}
        onOpenChange={(open) => !open && setViewingBakeryUsers(null)}
        bakery={viewingBakeryUsers}
      />
      <CreateUserDialog 
        open={showCreateUser} 
        onOpenChange={setShowCreateUser} 
      />
      <EditUserDialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        user={editingUser}
      />
      <UserPermissionsDialog
        open={!!managingUserPermissions}
        onOpenChange={(open) => !open && setManagingUserPermissions(null)}
        user={managingUserPermissions}
      />
      <DeleteAllDataDialog
        open={showDeleteAllData}
        onOpenChange={setShowDeleteAllData}
      />
      <DeleteConfirmDialog
        open={!!deletingBakery}
        onOpenChange={(open) => !open && setDeletingBakery(null)}
        title="Slett bakeri"
        description={`Er du sikker på at du vil slette bakeriet "${deletingBakery?.name}"? Denne handlingen kan ikke angres og alle tilknyttede data vil bli slettet.`}
        onConfirm={onDeleteBakery}
        isLoading={deleteBakeryLoading}
        confirmText="Slett bakeri"
      />
      <DeleteConfirmDialog
        open={!!deactivatingUser}
        onOpenChange={(open) => !open && setDeactivatingUser(null)}
        title="Deaktiver bruker"
        description={`Er du sikker på at du vil deaktivere brukeren "${deactivatingUser?.name || deactivatingUser?.email}"? Brukeren vil ikke lenger kunne logge inn, men kan reaktiveres senere.`}
        onConfirm={onDeactivateUser}
        isLoading={deactivateUserLoading}
        confirmText="Deaktiver"
      />
      <DeleteConfirmDialog
        open={!!reactivatingUser}
        onOpenChange={(open) => !open && setReactivatingUser(null)}
        title="Reaktiver bruker"
        description={`Er du sikker på at du vil reaktivere brukeren "${reactivatingUser?.name || reactivatingUser?.email}"? Brukeren vil igjen kunne logge inn i systemet.`}
        onConfirm={onReactivateUser}
        isLoading={reactivateUserLoading}
        confirmText="Reaktiver"
      />
      <DeleteConfirmDialog
        open={!!permanentDeletingUser}
        onOpenChange={(open) => !open && setPermanentDeletingUser(null)}
        title="Slett bruker permanent"
        description={`Er du sikker på at du vil slette brukeren "${permanentDeletingUser?.name || permanentDeletingUser?.email}" PERMANENT? Denne handlingen kan IKKE angres og vil fjerne all brukerdata fra systemet.`}
        onConfirm={onPermanentDeleteUser}
        isLoading={permanentDeleteUserLoading}
        confirmText="Slett permanent"
      />
    </>
  );
};

export default AdminDialogs;
