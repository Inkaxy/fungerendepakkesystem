import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center gradient-warm p-4">
      <div className="text-center max-w-md">
        {/* Bakery-themed illustration */}
        <div className="relative mb-8">
          <div className="text-8xl font-bold text-primary/20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Search className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Oops! Siden finnes ikke
        </h1>

        {/* Description */}
        <p className="text-muted-foreground mb-8">
          Det ser ut som denne siden har gått ut på dato, akkurat som et brød som 
          ble glemt i ovnen. La oss hjelpe deg tilbake til riktig sted!
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="hover-lift">
            <Link to="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Gå til Dashboard
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Gå tilbake
          </Button>
        </div>

        {/* Path info */}
        <p className="mt-8 text-xs text-muted-foreground">
          Forsøkte å åpne: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
