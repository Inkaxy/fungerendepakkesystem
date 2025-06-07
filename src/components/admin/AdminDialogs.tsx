
import React from 'react';
import CreateBakeryDialog from '@/components/admin/CreateBakeryDialog';
import EditBakeryDialog from '@/components/admin/EditBakeryDialog';
import ViewUsersDialog from '@/components/admin/ViewUsersDialog';
import CreateUserDialog from '@/components/admin/CreateUserDialog';
import EditUserDialog from '@/components/admin/EditUserDialog';
import UserPermissionsDialog from '@/components/admin/UserPermissionsDialog';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

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
  deletingUser: User | null;
  setDeletingUser: (user: User | null) => void;
  onDeleteBakery: () => void;
  onDeleteUser: () => void;
  deleteBakeryLoading: boolean;
  deleteUserLoading: boolean;
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
  deletingUser,
  setDeletingUser,
  onDeleteBakery,
  onDeleteUser,
  deleteBakeryLoading,
  deleteUserLoading,
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
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        title="Slett bruker permanent"
        description={`Er du sikker på at du vil slette brukeren "${deletingUser?.name || deletingUser?.email}" permanent? Denne handlingen kan ikke angres og vil fjerne brukeren fra systemet helt.`}
        onConfirm={onDeleteUser}
        isLoading={deleteUserLoading}
        confirmText="Slett bruker"
      />
    </>
  );
};

export default AdminDialogs;
