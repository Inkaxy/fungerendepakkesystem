import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState(prev => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prev.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-background">
          <Card className="max-w-md w-full">
            <CardContent className="text-center p-8">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive/70" />
              <h2 className="text-xl font-bold mb-2 text-foreground">Noe gikk galt</h2>
              <p className="mb-6 text-muted-foreground text-sm">
                Displayet kunne ikke lastes. Prøv å oppdatere siden.
              </p>
              
              {isDev && this.state.error && (
                <div className="mb-6 p-3 bg-destructive/10 rounded-md text-left">
                  <p className="text-xs font-mono text-destructive break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                {this.state.retryCount < 3 && (
                  <Button variant="outline" onClick={this.handleRetry} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Prøv igjen
                  </Button>
                )}
                <Button onClick={this.handleReload}>
                  Oppdater siden
                </Button>
              </div>
              
              {this.state.retryCount >= 3 && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Flere forsøk mislyktes. Vennligst oppdater siden.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
