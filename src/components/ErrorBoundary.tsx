import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
          <Card className="max-w-md">
            <CardContent className="text-center p-12">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-amber-500" />
              <h2 className="text-2xl font-bold mb-4">Noe gikk galt</h2>
              <p className="mb-6 text-gray-600">
                Displayet kunne ikke lastes. Prøv å oppdatere siden.
              </p>
              <Button onClick={() => window.location.reload()}>
                Oppdater siden
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
