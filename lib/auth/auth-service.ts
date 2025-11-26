import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// Define types
export interface UserSession {
  userId: string;
  email: string;
  role: "customer" | "seller";
  businessId?: string;
  exp: number;
  iat: number;
}

// Constants
const AUTH_TOKEN_NAME = "auth_token";
const BUSINESS_KEY_NAME = "business_key";
const CART_ID_NAME = "cart_id";

// API endpoints
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yourdomain.com";
const LOGIN_ENDPOINT = `${API_URL}/auth/login`;
const SIGNUP_ENDPOINT = `${API_URL}/auth/signup`;
const SELLER_LOGIN_ENDPOINT = `${API_URL}/auth/seller/login`;
const SELLER_SIGNUP_ENDPOINT = `${API_URL}/auth/seller/signup`;

// Core authentication service
export const authService = {
  // Session Management
  getSession: async (): Promise<UserSession | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_NAME)?.value;

    if (!token) {
      return null;
    }

    try {
      // Decode JWT without verification (verification happens on API side)
      const decoded = jwtDecode<UserSession>(token);

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        return null;
      }

      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const session = await authService.getSession();
    return !!session;
  },

  // Check if user is a seller
  isSeller: async (): Promise<boolean> => {
    const session = await authService.getSession();
    return !!session && session.role === "seller";
  },

  // Check if user is a customer
  isCustomer: async (): Promise<boolean> => {
    const session = await authService.getSession();
    return !!session && session.role === "customer";
  },

  // Get business key for seller
  getBusinessKey: async (): Promise<string | undefined> => {
    const cookieStore = await cookies();
    return cookieStore.get(BUSINESS_KEY_NAME)?.value;
  },

  // Get cart ID
  getCartId: async (): Promise<string | undefined> => {
    const cookieStore = await cookies();
    return cookieStore.get(CART_ID_NAME)?.value;
  },

  // Authentication actions
  loginUser: async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || "Failed to login" };
      }

      // Token and cart ID are set by the API in cookies
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  },

  loginSeller: async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(SELLER_LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || "Failed to login" };
      }

      // Token and business key are set by the API in cookies
      return { success: true };
    } catch (error) {
      console.error("Seller login error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  },

  signupUser: async (
    userData: any
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(SIGNUP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Failed to create account",
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  },

  signupSeller: async (
    sellerData: any
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(SELLER_SIGNUP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sellerData),
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Failed to create seller account",
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Seller signup error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  },

  logout: async (): Promise<void> => {
    // Note: This assumes your API handles clearing cookies on logout
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      cache: "no-store",
    });
  },
};

// Route protection utilities
export function requireAuth() {
  return authService.isAuthenticated().then((isAuthenticated) => {
    if (!isAuthenticated) {
      redirect("/login");
    }
  });
}

export function requireSellerAuth() {
  return authService.isSeller().then((isSeller) => {
    if (!isSeller) {
      redirect("/seller/login");
    }
  });
}

export function requireCustomerAuth() {
  return authService.isCustomer().then((isCustomer) => {
    if (!isCustomer) {
      redirect("/login");
    }
  });
}
