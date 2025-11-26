"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "customer" | "seller";
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const {
    isAuthenticated,
    isLoading,
    user,
    setShowLoginModal,
    setLoginModalReturnUrl,
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip if still loading
    if (isLoading) return;

    // Check authentication
    if (!isAuthenticated) {
      // Store current path to redirect back after login
      setLoginModalReturnUrl(pathname);

      // Show login modal
      setShowLoginModal(true);
      return;
    }

    // If role check is required
    if (requiredRole && user?.role !== requiredRole) {
      // Handle unauthorized access based on role
      if (requiredRole === "seller") {
        router.push("/seller/login");
      } else {
        router.push("/login");
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    requiredRole,
    pathname,
    router,
    setShowLoginModal,
    setLoginModalReturnUrl,
  ]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // If authenticated and has the required role, render children
  if (isAuthenticated && (!requiredRole || user?.role === requiredRole)) {
    return <>{children}</>;
  }

  // Default: render nothing while redirecting
  return null;
}
