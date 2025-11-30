"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { AuthUser, OnboardingStep } from "@/types/user";
import { updateUserSession } from "@/actions/update.session";
import { removeDot } from "@/utils/remote-dot";
import SecureStorage from "@/lib/auth/secure-storage";
import { jwtDecode } from "jwt-decode";

// JWT Payload interface
interface JWTPayload {
  exp?: number;
  iat?: number;
  [key: string]: any;
}

// Define seller types
export type SellerType = "internal" | "external";

// Define user types
export type User = {
  id: string;
  name?: string;
  email: string;
  role: "customer" | "seller";
  cartId?: string;
  businessId?: string;
  businessKey?: string;

  // Seller-specific fields
  sellerType?: SellerType;
  onboardingStatus?: {
    completed: boolean;
    currentStep: OnboardingStep;
    passwordChanged?: boolean;
    agreementSigned?: boolean;
    subscriptionActive?: boolean;
  };

  // Default password status (for internal sellers)
  isDefaultPassword?: boolean;
};

// Add this interface for token validation
interface TokenValidationResult {
  isValid: boolean;
  isExpired: boolean;
  needsRefresh: boolean;
}

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSeller: boolean;
  isCustomer: boolean;
  isInternalSeller: boolean;
  isExternalSeller: boolean;
  needsOnboarding: boolean;
  currentOnboardingStep: OnboardingStep | null;

  // Auth functions
  login: (
    email: string,
    password: string,
    redirectUrl?: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginSeller: (
    email: string,
    password: string,
    redirectUrl?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: any) => Promise<{ success: boolean; error?: string }>;
  signupSeller: (
    sellerData: any
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  authenticateUser: (
    email: string,
    password: string,
    storeId: string
  ) => Promise<{
    success: boolean;
    error?: string;
    userType?: "customer" | "seller";
    redirectUrl?: string;
  }>;

  // Token validation
  validateToken: () => Promise<TokenValidationResult>;
  handleTokenExpiration: () => Promise<void>;

  // Onboarding functions
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  signAgreement: (
    agreed: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  selectSubscription: (
    planId: string
  ) => Promise<{ success: boolean; error?: string }>;
  completeOnboarding: () => Promise<{ success: boolean; error?: string }>;

  // Modal state
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  loginModalReturnUrl: string | null;
  setLoginModalReturnUrl: (url: string | null) => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to check if JWT token is expired
function isJWTExpired(token: string): boolean {
  if (!token) return true;

  try {
    const decoded = jwtDecode<JWTPayload>(token);

    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    }

    // If no expiration info, consider it expired for safety
    return true;
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return true;
  }
}

// Auth provider component
export function AuthProvider({
  children,
  initialUser = null,
  session,
}: {
  children: ReactNode;
  initialUser?: AuthUser | null;
  session: Session | null;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalReturnUrl, setLoginModalReturnUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (session?.user) {
      const sessionUser = session.user as AuthUser;
      setUser(sessionUser);

      // Store auth data securely for client-side API calls
      if (sessionUser.token) {
        // Decode the JWT to get the expiration time
        try {
          const decoded = jwtDecode<JWTPayload>(sessionUser.token);
          const expiresAt = decoded.exp
            ? decoded.exp * 1000
            : Date.now() + 24 * 60 * 60 * 1000;

          SecureStorage.setAuthData({
            token: sessionUser.token,
            businessId: sessionUser.businessId,
            userId: sessionUser.id,
            expiresAt,
          });
        } catch (error) {
          console.error("Failed to decode token for storage:", error);
          // Fallback to 24 hours
          SecureStorage.setAuthData({
            token: sessionUser.token,
            businessId: sessionUser.businessId,
            userId: sessionUser.id,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          });
        }
      }
    } else if (session === null) {
      setUser(null);
      SecureStorage.clearAuthData();
    }
  }, [session]);

  // Derived states
  const isAuthenticated = !!user;
  const isSeller = !!user && user.role === "seller";
  const isCustomer = !!user && user.role === "customer";
  const isInternalSeller =
    isSeller && user?.businessType === "reseller-internal";
  const isExternalSeller =
    isSeller && user?.businessType === "reseller-external";

  // Onboarding state
  const needsOnboarding =
    isSeller && user?.onboardingStatus && !user?.onboardingStatus.completed;

  const currentOnboardingStep = needsOnboarding
    ? user?.onboardingStatus?.currentStep || null
    : null;

  // Token validation method
  const validateToken = async (): Promise<TokenValidationResult> => {
    if (!user?.token) {
      return { isValid: false, isExpired: true, needsRefresh: false };
    }

    try {
      // Check if JWT token is expired
      if (isJWTExpired(user.token)) {
        return { isValid: false, isExpired: true, needsRefresh: true };
      }

      // Validate token with server
      const response = await fetch("/api/auth/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        return { isValid: false, isExpired: true, needsRefresh: true };
      }

      const data = await response.json();
      return {
        isValid: data.valid,
        isExpired: !data.valid,
        needsRefresh: !data.valid,
      };
    } catch (error) {
      console.error("Token validation failed:", error);
      return { isValid: false, isExpired: true, needsRefresh: true };
    }
  };

  // Handle token expiration
  const handleTokenExpiration = async (): Promise<void> => {
    try {
      // Clear server-side session first to prevent redirect loops
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // Clear user state and secure storage
      setUser(null);
      SecureStorage.clearAuthData();

      // Close any open modals
      setShowLoginModal(false);

      // Store current path for redirect after login
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        setLoginModalReturnUrl(currentPath);
      }

      // Redirect to login with expired flag
      const loginUrl = new URL("/login", window.location.origin);
      loginUrl.searchParams.set("expired", "true");
      if (currentPath !== "/login") {
        loginUrl.searchParams.set("callbackUrl", currentPath);
      }

      window.location.href = loginUrl.toString();
    } catch (error) {
      console.error("Error handling token expiration:", error);
      // Fallback: force reload to clear state
      window.location.reload();
    }
  };

  // Auto-validate token periodically for authenticated users
  useEffect(() => {
    if (!isAuthenticated || !user?.token) return;

    const validateTokenPeriodically = async () => {
      const validation = await validateToken();

      if (!validation.isValid && validation.isExpired) {
        await handleTokenExpiration();
      }
    };

    // Validate immediately
    validateTokenPeriodically();

    // Set up periodic validation (every 5 minutes)
    const interval = setInterval(validateTokenPeriodically, 5 * 60 * 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.token]);

  // Validate token on page focus (when user returns to tab)
  useEffect(() => {
    if (!isAuthenticated || !user?.token) return;

    const handleFocus = async () => {
      const validation = await validateToken();

      if (!validation.isValid && validation.isExpired) {
        await handleTokenExpiration();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.token]);

  // Function to refresh auth state from server
  const refreshAuthState = async () => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to refresh auth state:", error);
      setUser(null);
    }
  };

  // Check onboarding status and redirect if needed
  useEffect(() => {
    if (needsOnboarding && user?.onboardingStatus?.currentStep) {
      const { hostname, pathname } = window.location;
      const mainDomain = removeDot(
        process.env.NEXT_PUBLIC_ROOT_DOMAIN || "resellerivo.com"
      );

      const isMainDomain =
        hostname === mainDomain ||
        hostname === `www.${mainDomain}` ||
        hostname.includes("localhost");

      // Redirect if on a subdomain and not already in the onboarding flow
      if (!isMainDomain && !pathname.includes("/onboarding/")) {
        router.push(`/onboarding/${user.onboardingStatus.currentStep}`);
      }
    }
  }, [needsOnboarding, user?.onboardingStatus?.currentStep, router]);

  // Login for customers
  const login = async (
    email: string,
    password: string,
    redirectUrl?: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || "Login failed" };
      }

      // Update user state
      setUser(data.user);
      if (data.user?.token) {
        SecureStorage.setAuthData({
          token: data.user.token,
          businessId: data.user.businessId,
          userId: data.user.id,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
      }
      setIsLoading(false);

      // Close modal if open
      setShowLoginModal(false);

      // Handle redirect
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (loginModalReturnUrl) {
        router.push(loginModalReturnUrl);
        setLoginModalReturnUrl(null);
      }

      // Refresh router to update UI with authenticated state
      router.refresh();

      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  // Login for sellers
  const loginSeller = async (
    email: string,
    password: string,
    redirectUrl?: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/seller/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Seller login response:', data);

      if (!response.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || "Login failed" };
      }

      // Update user state
      setUser(data.user);
      setIsLoading(false);

      // Close modal if open
      setShowLoginModal(false);

      // Check if onboarding is needed
      if (
        data.user?.onboardingStatus &&
        !data.user.onboardingStatus.completed
      ) {
        // Get the seller's subdomain
        const subdomain = data.user.subdomain || data.user.businessId;
        console.log('Redirecting to onboarding for subdomain:', subdomain);
        
        // Redirect to appropriate onboarding step on seller's subdomain
        router.push(`/${subdomain}/onboarding/${data.user.onboardingStatus.currentStep}`);
        return { success: true };
      }

      // If redirectUrl is provided, use it
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        // Check if we should redirect to this seller's subdomain
        const currentHostname = window.location.hostname;
        const sellerSubdomain = data.user.subdomain || data.user.businessId;
        const mainDomain = removeDot(
          process.env.NEXT_PUBLIC_ROOT_DOMAIN || "resellerivo.com"
        );
        
        console.log('Seller redirect info:', { sellerSubdomain, currentHostname, mainDomain });

        // If we're not already on the seller's subdomain, redirect there
        if (sellerSubdomain && !currentHostname.startsWith(`${sellerSubdomain}.`)) {
          window.location.href = `https://${sellerSubdomain}.${mainDomain}/dashboard`;
          return { success: true };
        }

        // Otherwise just go to the dashboard
        router.push("/dashboard");
      }

      // Refresh router to update UI with authenticated state
      router.refresh();

      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  // Signup for customers
  const signup = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        console.log(data, "data")
        return { success: false, error: data.error || "Signup failed" };
      }

      setIsLoading(false);

      // Auto-login after successful signup
      return authenticateUser(userData.email, userData.password, "");
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Signup failed",
      };
    }
  };

  // Signup for external sellers
  const signupSeller = async (sellerData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/seller/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sellerData),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || "Signup failed" };
      }

      setIsLoading(false);

      // Auto-login after successful signup
      return loginSeller(
        sellerData.email,
        sellerData.password,
        "/onboarding/subscription"
      );
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Signup failed",
      };
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // Clear user state
      setUser(null);
      SecureStorage.clearAuthData();
      setIsLoading(false);

      // Refresh router to update UI with unauthenticated state
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
    }
  };

  // Update password (for onboarding or password change)
  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return {
          success: false,
          error: data.error || "Failed to update password",
        };
      }

      // Update user state
      setUser((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          isDefaultPassword: false,
          onboardingStatus: {
            ...prev.onboardingStatus!,
            passwordChanged: true,
            currentStep: "agreement",
          },
        };
      });

      setIsLoading(false);

      // Move to next onboarding step
      router.push("/onboarding/agreement");

      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update password",
      };
    }
  };

  // Sign agreement
  const signAgreement = async (agreed: boolean) => {
    if (!agreed) {
      return {
        success: false,
        error: "You must agree to the terms to continue",
      };
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/sign-agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return {
          success: false,
          error: data.error || "Failed to process agreement",
        };
      }

      // Update user state
      setUser((prev) => {
        if (!prev) return null;

        // Determine next step based on seller type
        let nextStep: OnboardingStep = "welcome";
        if (
          prev.businessType === "reseller-external" &&
          !prev.onboardingStatus?.subscriptionActive
        ) {
          nextStep = "subscription";
        }

        return {
          ...prev,
          onboardingStatus: {
            ...prev.onboardingStatus!,
            agreementSigned: true,
            currentStep: nextStep,
          },
        };
      });

      setIsLoading(false);

      // Move to next onboarding step (different for internal vs external)
      const nextStep = isExternalSeller
        ? "/onboarding/subscription"
        : "/onboarding/welcome";
      router.push(nextStep);

      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process agreement",
      };
    }
  };

  // Select subscription (for external sellers)
  const selectSubscription = async (planId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/select-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return {
          success: false,
          error: data.error || "Failed to process subscription",
        };
      }

      // Update user state
      setUser((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          onboardingStatus: {
            ...prev.onboardingStatus!,
            subscriptionActive: true,
            currentStep: "welcome",
          },
        };
      });

      setIsLoading(false);

      // Move to next onboarding step
      router.push("/onboarding/welcome");

      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process subscription",
      };
    }
  };

  // Complete onboarding
  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return {
          success: false,
          error: data.error || "Failed to complete onboarding",
        };
      }

      // Create updated user state
      const updatedUser = {
        ...user,
        onboardingStatus: {
          ...user?.onboardingStatus!,
          completed: true,
          currentStep: "",
        },
        onboardingComplete: true,
      };

      // Update session on the server using server action
      await updateUserSession(updatedUser);

      // Update local user state
      //@ts-expect-error
      setUser(updatedUser);
      setIsLoading(false);

      // Redirect to dashboard
      router.push("/dashboard");

      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to complete onboarding",
      };
    }
  };

  const authenticateUser = async (
    email: string,
    password: string,
    storeId: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login API response:', data);

      if (!response.ok || data.error) {
        setIsLoading(false);
        return { success: false, error: data.error || "Login failed" };
      }

      // ✅ Update session on the server
      console.log('Setting user data in session:', data.user);
      await updateUserSession(data.user);

      // ✅ Update local state immediately
      setUser(data.user);

      // ✅ Refresh session from API to ensure sync
      await refreshAuthState();

      setIsLoading(false);

      const callbackParams = new URLSearchParams({ storeId });
      return {
        success: true,
        redirectUrl: `/auth-callback?${callbackParams.toString()}`,
      };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };


  // Context value
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isSeller,
    isCustomer,
    isInternalSeller,
    isExternalSeller,
    needsOnboarding: needsOnboarding!,
    currentOnboardingStep,
    validateToken,
    handleTokenExpiration,
    login,
    loginSeller,
    signup,
    signupSeller,
    logout,
    refreshAuthState,
    updatePassword,
    signAgreement,
    selectSubscription,
    authenticateUser,
    setIsLoading,
    completeOnboarding,
    showLoginModal,
    setShowLoginModal,
    loginModalReturnUrl,
    setLoginModalReturnUrl,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
