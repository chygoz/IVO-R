"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ErrorBoundary from "../ui/error.boundary";

interface ErrorBoundaryWrapperProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export default function ErrorBoundaryWrapper({
    children,
    fallback,
    onError,
}: ErrorBoundaryWrapperProps) {
    // Create a reset key that changes whenever the route changes
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [resetKey, setResetKey] = useState(0);

    // Reset error boundary when route changes
    useEffect(() => {
        setResetKey((prev) => prev + 1);
    }, [pathname, searchParams]);

    return (
        <ErrorBoundary fallback={fallback} onError={onError} resetKey={resetKey}>
            {children}
        </ErrorBoundary>
    );
}