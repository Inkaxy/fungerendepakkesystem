
import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';
import { useBakeries, useDeleteBakery } from '@/hooks/useBakeries';
import { useProfiles, useDeleteProfile } from '@/hooks/useProfiles';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStats from '@/components/admin/AdminStats';
import BakeriesSection from '@/components/admin/BakeriesSection';
import UsersSection from '@/components/admin/UsersSection';
import AdminDialogs from '@/components/admin/AdminDialogs';

const Admin = () => {
  const { profile } = useAuthStore();
  const [showCreateBakery, setShowCreateBakery] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deletingBakery, setDeletingBakery] = useState<any>(null);
  const [deletingUser, setDeletingUser] = useState<any>(null);
  
  const { data: bakeries, isLoading: bakeriesLoading } = useBakeries();
  const { data: profiles, isLoading: profilesLoading } = useProfiles();
  const deleteBakery = useDeleteBakery();
  const deleteProfile = useDeleteProfile();

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

  const handleDeleteUser = async () => {
    if (deletingUser) {
      await deleteProfile.mutateAsync(deletingUser.id);
      setDeletingUser(null);
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
      />

      <UsersSection 
        profiles={profiles}
        onEditUser={setEditingUser}
        onDeleteUser={setDeletingUser}
      />

      <AdminDialogs
        showCreateBakery={showCreateBakery}
        setShowCreateBakery={setShowCreateBakery}
        showCreateUser={showCreateUser}
        setShowCreateUser={setShowCreateUser}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        deletingBakery={deletingBakery}
        setDeletingBakery={setDeletingBakery}
        deletingUser={deletingUser}
        setDeletingUser={setDeletingUser}
        onDeleteBakery={handleDeleteBakery}
        onDeleteUser={handleDeleteUser}
        deleteBakeryLoading={deleteBakery.isPending}
        deleteUserLoading={deleteProfile.isPending}
      />
    </div>
  );
};

export default Admin;
