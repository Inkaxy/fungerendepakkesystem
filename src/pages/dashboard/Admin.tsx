
import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';
import { useBakeries, useDeleteBakery } from '@/hooks/useBakeries';
import { useProfiles, useDeleteProfile, useReactivateProfile, usePermanentDeleteProfile } from '@/hooks/useProfiles';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStats from '@/components/admin/AdminStats';
import BakeriesSection from '@/components/admin/BakeriesSection';
import UsersSection from '@/components/admin/UsersSection';
import AdminDialogs from '@/components/admin/AdminDialogs';

const Admin = () => {
  const { profile } = useAuthStore();
  const [showCreateBakery, setShowCreateBakery] = useState(false);
  const [editingBakery, setEditingBakery] = useState<any>(null);
  const [viewingBakeryUsers, setViewingBakeryUsers] = useState<any>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [managingUserPermissions, setManagingUserPermissions] = useState<any>(null);
  const [deletingBakery, setDeletingBakery] = useState<any>(null);
  const [deactivatingUser, setDeactivatingUser] = useState<any>(null);
  const [reactivatingUser, setReactivatingUser] = useState<any>(null);
  const [permanentDeletingUser, setPermanentDeletingUser] = useState<any>(null);
  
  const { data: bakeries, isLoading: bakeriesLoading } = useBakeries();
  const { data: profiles, isLoading: profilesLoading } = useProfiles();
  const deleteBakery = useDeleteBakery();
  const deactivateProfile = useDeleteProfile(); // This is now deactivation
  const reactivateProfile = useReactivateProfile();
  const permanentDeleteProfile = usePermanentDeleteProfile();

  // Only super_admin should see this page
  if (profile?.role !== 'super_admin') {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ingen tilgang</h1>
          <p className="text-gray-600">Du har ikke tilgang til administrasjonspanelet.</p>
        </div>
      </div>
    );
  }

  const handleDeleteBakery = async () => {
    if (deletingBakery) {
      await deleteBakery.mutateAsync(deletingBakery.id);
      setDeletingBakery(null);
    }
  };

  const handleDeactivateUser = async () => {
    if (deactivatingUser) {
      await deactivateProfile.mutateAsync(deactivatingUser.id);
      setDeactivatingUser(null);
    }
  };

  const handleReactivateUser = async () => {
    if (reactivatingUser) {
      await reactivateProfile.mutateAsync(reactivatingUser.id);
      setReactivatingUser(null);
    }
  };

  const handlePermanentDeleteUser = async () => {
    if (permanentDeletingUser) {
      await permanentDeleteProfile.mutateAsync(permanentDeletingUser.id);
      setPermanentDeletingUser(null);
    }
  };

  if (bakeriesLoading || profilesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalBakeries = bakeries?.length || 0;
  const totalUsers = profiles?.length || 0;
  const superAdmins = profiles?.filter(p => p.role === 'super_admin').length || 0;
  const activeUsers = profiles?.filter(p => p.is_active).length || 0;

  return (
    <div className="space-y-6">
      <AdminHeader 
        onCreateBakery={() => setShowCreateBakery(true)}
        onCreateUser={() => setShowCreateUser(true)}
      />

      <AdminStats 
        totalBakeries={totalBakeries}
        totalUsers={totalUsers}
        superAdmins={superAdmins}
        activeUsers={activeUsers}
      />

      <BakeriesSection 
        bakeries={bakeries}
        onDeleteBakery={setDeletingBakery}
        onEditBakery={setEditingBakery}
        onViewUsers={setViewingBakeryUsers}
      />

      <UsersSection 
        profiles={profiles}
        onEditUser={setEditingUser}
        onDeactivateUser={setDeactivatingUser}
        onReactivateUser={setReactivatingUser}
        onPermanentDeleteUser={setPermanentDeletingUser}
        onManagePermissions={setManagingUserPermissions}
      />

      <AdminDialogs
        showCreateBakery={showCreateBakery}
        setShowCreateBakery={setShowCreateBakery}
        editingBakery={editingBakery}
        setEditingBakery={setEditingBakery}
        viewingBakeryUsers={viewingBakeryUsers}
        setViewingBakeryUsers={setViewingBakeryUsers}
        showCreateUser={showCreateUser}
        setShowCreateUser={setShowCreateUser}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        managingUserPermissions={managingUserPermissions}
        setManagingUserPermissions={setManagingUserPermissions}
        deletingBakery={deletingBakery}
        setDeletingBakery={setDeletingBakery}
        deactivatingUser={deactivatingUser}
        setDeactivatingUser={setDeactivatingUser}
        reactivatingUser={reactivatingUser}
        setReactivatingUser={setReactivatingUser}
        permanentDeletingUser={permanentDeletingUser}
        setPermanentDeletingUser={setPermanentDeletingUser}
        onDeleteBakery={handleDeleteBakery}
        onDeactivateUser={handleDeactivateUser}
        onReactivateUser={handleReactivateUser}
        onPermanentDeleteUser={handlePermanentDeleteUser}
        deleteBakeryLoading={deleteBakery.isPending}
        deactivateUserLoading={deactivateProfile.isPending}
        reactivateUserLoading={reactivateProfile.isPending}
        permanentDeleteUserLoading={permanentDeleteProfile.isPending}
      />
    </div>
  );
};

export default Admin;
