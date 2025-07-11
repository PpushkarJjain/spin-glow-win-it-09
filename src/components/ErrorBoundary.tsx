import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleRefresh = () => {
    // Clear any corrupted localStorage data that might be causing issues
    try {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("offerDistribution");
      localStorage.removeItem("totalSpins");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
    
    // Reset the error boundary
    this.setState({ hasError: false, error: undefined });
    
    // Reload the page
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-festive flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-festive border-2 border-destructive/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-xl font-bold text-destructive">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Don't worry! This is just a temporary glitch. Try refreshing the page.
              </p>
              {process.env.NODE_ENV === "development" && (
                <details className="text-left text-xs bg-muted p-3 rounded">
                  <summary className="cursor-pointer">Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.error?.message}
                  </pre>
                </details>
              )}
              <Button
                onClick={this.handleRefresh}
                className="w-full bg-gradient-primary hover:shadow-glow"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
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