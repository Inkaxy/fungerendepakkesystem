import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Link2,
  Monitor,
  ExternalLink,
  Store,
} from 'lucide-react';
import { Tablet } from '@/types/tablet';
import TabletStatusBadge from './TabletStatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';

interface TabletsTableProps {
  tablets: Tablet[];
  onEdit: (tablet: Tablet) => void;
  onDelete: (tablet: Tablet) => void;
  onLink: (tablet: Tablet) => void;
  onViewDisplay: (tablet: Tablet) => void;
}

const TabletsTable: React.FC<TabletsTableProps> = ({
  tablets,
  onEdit,
  onDelete,
  onLink,
  onViewDisplay,
}) => {
  const formatLastSeen = (date: string | null) => {
    if (!date) return 'Aldri';
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: nb });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Navn</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tilknyttet butikk</TableHead>
            <TableHead>IP-adresse</TableHead>
            <TableHead>Sist aktiv</TableHead>
            <TableHead className="text-right">Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tablets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                Ingen nettbrett registrert
              </TableCell>
            </TableRow>
          ) : (
            tablets.map((tablet) => (
              <TableRow key={tablet.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{tablet.name}</span>
                    {tablet.model && (
                      <span className="text-xs text-muted-foreground">
                        {tablet.model}
                        {tablet.android_version && ` • Android ${tablet.android_version}`}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <TabletStatusBadge status={tablet.status} />
                </TableCell>
                <TableCell>
                  {tablet.customer ? (
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-sm">{tablet.customer.name}</span>
                        {tablet.customer.customer_number && (
                          <span className="text-xs text-muted-foreground">
                            #{tablet.customer.customer_number}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Ikke tilknyttet</span>
                  )}
                </TableCell>
                <TableCell>
                  {tablet.ip_address ? (
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {tablet.ip_address}
                    </code>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatLastSeen(tablet.last_seen_at)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDisplay(tablet)}>
                        <Monitor className="w-4 h-4 mr-2" />
                        Se skjerm
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onLink(tablet)}>
                        <Link2 className="w-4 h-4 mr-2" />
                        Koble til butikk
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(tablet)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Rediger
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(tablet)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Slett
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TabletsTable;
