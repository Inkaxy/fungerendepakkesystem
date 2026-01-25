import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Package, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';

interface ActivityItem {
  id: string;
  type: 'order_packed' | 'order_created' | 'customer_added';
  message: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[] | undefined;
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const navigate = useNavigate();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order_packed':
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'order_created':
        return <Package className="h-4 w-4 text-accent-foreground" />;
      case 'customer_added':
        return <Users className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case 'order_packed':
        return 'bg-primary/10';
      case 'order_created':
        return 'bg-accent';
      case 'customer_added':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  const getNavigationPath = (activityType: string) => {
    switch (activityType) {
      case 'order_packed':
      case 'order_created':
        return '/dashboard/orders';
      case 'customer_added':
        return '/dashboard/customers';
      default:
        return null;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Siste Aktivitet</CardTitle>
            <CardDescription>
              Nylige hendelser i systemet
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {activities && activities.length > 0 ? (
            activities.map((activity) => {
              const navigationPath = getNavigationPath(activity.type);
              
              return (
                <button
                  key={activity.id}
                  onClick={() => navigationPath && navigate(navigationPath)}
                  className="group w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 text-left"
                >
                  <div className={`p-2 rounded-lg ${getActivityBg(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { 
                        addSuffix: true, 
                        locale: nb 
                      })}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="p-3 rounded-full bg-muted mb-3">
                <Activity className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Ingen nylige aktiviteter</p>
              <p className="text-xs text-muted-foreground mt-1">
                Aktiviteter vil vises her når de skjer
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
