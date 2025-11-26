"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    resetKey?: any;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // You can log the error to an error reporting service
        console.error("Error caught by ErrorBoundary:", error, errorInfo);

        // Set state with error details
        this.setState({ errorInfo });

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps): void {
        // If resetKey changes, reset the error boundary state
        if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
            });
        }
    }

    resetErrorBoundary = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // If a custom fallback is provided, render it
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Otherwise render our default error UI
            return (
                <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[200px]">
                    <Alert className="max-w-3xl w-full border-destructive">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <AlertTitle className="text-destructive">
                            Something went wrong
                        </AlertTitle>
                        <AlertDescription className="mt-2">
                            {this.state.error && (
                                <div className="text-sm text-muted-foreground mb-4">
                                    {this.state.error.toString()}
                                </div>
                            )}
                            <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                >
                                    Reload Page
                                </Button>
                                <Button variant="default" onClick={this.resetErrorBoundary}>
                                    Try Again
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;