import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { UserProfile } from '@/stores/authStore';

interface DashboardHeaderProps {
  profile: UserProfile | null;
}

const DashboardHeader = ({ profile }: DashboardHeaderProps) => {
  const getRoleBadgeVariant = (role: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'bakery_admin': return 'default';
      case 'bakery_user': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'bakery_admin': return 'Bakeri Admin';
      case 'bakery_user': return 'Bakeri Bruker';
      default: return 'Bruker';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'God natt';
    if (hour < 12) return 'God morgen';
    if (hour < 18) return 'God ettermiddag';
    return 'God kveld';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 md:p-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {getGreeting()}, {profile?.name?.split(' ')[0] || 'Bruker'}!
          </h1>
          <p className="text-muted-foreground max-w-md">
            Her er oversikten over ditt bakeri-system
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Badge 
            variant={getRoleBadgeVariant(profile?.role || '')} 
            className="text-sm px-3 py-1"
          >
            {getRoleName(profile?.role || '')}
          </Badge>
          {profile?.bakery_name && (
            <p className="text-sm text-muted-foreground">
              {profile.bakery_name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
