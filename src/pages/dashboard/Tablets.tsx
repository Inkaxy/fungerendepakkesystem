import React, { useState } from 'react';
import { Tablet as TabletIcon, Plus, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/shared/PageHeader';
import LoadingState from '@/components/shared/LoadingState';
import EmptyState from '@/components/shared/EmptyState';
import { useTablets } from '@/hooks/useTablets';
import { Tablet } from '@/types/tablet';
import TabletsStats from '@/components/tablets/TabletsStats';
import TabletsTable from '@/components/tablets/TabletsTable';
import CreateTabletDialog from '@/components/tablets/CreateTabletDialog';
import EditTabletDialog from '@/components/tablets/EditTabletDialog';
import DeleteTabletDialog from '@/components/tablets/DeleteTabletDialog';
import LinkTabletDialog from '@/components/tablets/LinkTabletDialog';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const Tablets: React.FC = () => {
  const { data: tablets = [], isLoading, refetch } = useTablets();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTablet, setEditingTablet] = useState<Tablet | null>(null);
  const [deletingTablet, setDeletingTablet] = useState<Tablet | null>(null);
  const [linkingTablet, setLinkingTablet] = useState<Tablet | null>(null);

  const filteredTablets = tablets.filter((tablet) => {
    const query = searchQuery.toLowerCase();
    return (
      tablet.name.toLowerCase().includes(query) ||
      tablet.customer?.name?.toLowerCase().includes(query) ||
      tablet.ip_address?.toLowerCase().includes(query) ||
      tablet.device_id?.toLowerCase().includes(query)
    );
  });

  const handleRefresh = async () => {
    await refetch();
    toast.success('Liste oppdatert');
  };

  const handleViewDisplay = (tablet: Tablet) => {
    if (tablet.customer?.id) {
      // Open display URL in new tab
      const displayUrl = `/display/shared/${tablet.bakery_id}`;
      window.open(displayUrl, '_blank');
    } else {
      toast.info('Nettbrettet er ikke tilknyttet en butikk');
    }
  };

  if (isLoading) {
    return <LoadingState message="Laster nettbrett..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={TabletIcon}
        title="Nettbrett"
        subtitle="Administrer nettbrett og skjermenheter"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Oppdater
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Legg til nettbrett
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <TabletsStats tablets={tablets} />

      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Søk etter nettbrett, butikk eller IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table or empty state */}
      {tablets.length === 0 ? (
        <EmptyState
          icon={TabletIcon}
          title="Ingen nettbrett registrert"
          description="Legg til ditt første nettbrett for å komme i gang"
          action={{
            label: 'Legg til nettbrett',
            onClick: () => setCreateDialogOpen(true),
            icon: Plus
          }}
        />
      ) : (
        <TabletsTable
          tablets={filteredTablets}
          onEdit={setEditingTablet}
          onDelete={setDeletingTablet}
          onLink={setLinkingTablet}
          onViewDisplay={handleViewDisplay}
        />
      )}

      {/* Dialogs */}
      <CreateTabletDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <EditTabletDialog
        tablet={editingTablet}
        open={!!editingTablet}
        onOpenChange={(open) => !open && setEditingTablet(null)}
      />

      <DeleteTabletDialog
        tablet={deletingTablet}
        open={!!deletingTablet}
        onOpenChange={(open) => !open && setDeletingTablet(null)}
      />

      <LinkTabletDialog
        tablet={linkingTablet}
        open={!!linkingTablet}
        onOpenChange={(open) => !open && setLinkingTablet(null)}
      />
    </div>
  );
};

export default Tablets;
