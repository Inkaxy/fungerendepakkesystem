import React from 'react';
import { Building, Users, Shield, CheckCircle } from 'lucide-react';

interface AdminStatsProps {
  totalBakeries: number;
  totalUsers: number;
  superAdmins: number;
  activeUsers: number;
}

const AdminStats = ({ totalBakeries, totalUsers, superAdmins, activeUsers }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="stat-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Bakerier</p>
            <p className="text-2xl font-bold text-foreground">{totalBakeries}</p>
            <p className="text-xs text-muted-foreground mt-1">Alle aktive</p>
          </div>
          <div className="stat-card-icon">
            <Building className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Totale brukere</p>
            <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
            <p className="text-xs text-muted-foreground mt-1">{activeUsers} aktive</p>
          </div>
          <div className="stat-card-icon">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Super Admins</p>
            <p className="text-2xl font-bold text-foreground">{superAdmins}</p>
            <p className="text-xs text-muted-foreground mt-1">Systemadministratorer</p>
          </div>
          <div className="stat-card-icon">
            <Shield className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Systemstatus</p>
            <p className="text-2xl font-bold text-success">OK</p>
            <p className="text-xs text-muted-foreground mt-1">Alle systemer kjører</p>
          </div>
          <div className="p-2.5 rounded-lg bg-success/15">
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
