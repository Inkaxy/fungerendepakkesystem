import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, Users, ArrowRight, Upload, BarChart3, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  roleName: string;
}

const QuickActions = ({ roleName }: QuickActionsProps) => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Start pakking',
      description: 'Begynn pakking av ordrer',
      icon: Package,
      color: 'bg-primary/10 text-primary',
      path: '/dashboard/orders',
    },
    {
      title: 'Last opp data',
      description: 'Importer ordrer fra fil',
      icon: Upload,
      color: 'bg-accent text-accent-foreground',
      path: '/dashboard/orders',
    },
    {
      title: 'Se rapporter',
      description: 'Statistikk og avvik',
      icon: BarChart3,
      color: 'bg-secondary text-secondary-foreground',
      path: '/dashboard/reports',
    },
    {
      title: 'Administrer kunder',
      description: 'Kundeinformasjon',
      icon: Users,
      color: 'bg-muted text-muted-foreground',
      path: '/dashboard/customers',
    },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Hurtighandlinger</CardTitle>
            <CardDescription>
              Vanlige oppgaver for {roleName}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className="group w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">{action.title}</h4>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
