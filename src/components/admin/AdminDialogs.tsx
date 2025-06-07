
import React from 'react';
import CreateBakeryDialog from '@/components/admin/CreateBakeryDialog';
import CreateUserDialog from '@/components/admin/CreateUserDialog';
import EditUserDialog from '@/components/admin/EditUserDialog';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

interface Bakery {
  id: string;
  name: string;
}

interface User {
  id: string;
  name?: string;
  email?: string;
  role: string;
  bakery_id?: string;
  is_active: boolean;
}

interface AdminDialogsProps {
  showCreateBakery: boolean;
  setShowCreateBakery: (show: boolean) => void;
  showCreateUser: boolean;
  setShowCreateUser: (show: boolean) => void;
  editingUser: User | null;
  setEditingUser: (user: User | null) => void;
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
  showCreateUser,
  setShowCreateUser,
  editingUser,
  setEditingUser,
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
      <CreateUserDialog 
        open={showCreateUser} 
        onOpenChange={setShowCreateUser} 
      />
      <EditUserDialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        user={editingUser}
      />
      <DeleteConfirmDialog
        open={!!deletingBakery}
        onOpenChange={(open) => !open && setDeletingBakery(null)}
        title="Slett bakeri"
        description={`Er du sikker på at du vil slette bakeriet "${deletingBakery?.name}"? Denne handlingen kan ikke angres.`}
        onConfirm={onDeleteBakery}
        isLoading={deleteBakeryLoading}
      />
      <DeleteConfirmDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        title={deletingUser?.is_active ? "Deaktiver bruker" : "Reaktiver bruker"}
        description={
          deletingUser?.is_active 
            ? `Er du sikker på at du vil deaktivere brukeren "${deletingUser?.name || deletingUser?.email}"? Brukeren vil ikke lenger kunne logge inn, men kan reaktiveres senere.`
            : `Er du sikker på at du vil reaktivere brukeren "${deletingUser?.name || deletingUser?.email}"? Brukeren vil kunne logge inn igjen.`
        }
        onConfirm={onDeleteUser}
        isLoading={deleteUserLoading}
        confirmText={deletingUser?.is_active ? "Deaktiver" : "Reaktiver"}
      />
    </>
  );
};

export default AdminDialogs;
