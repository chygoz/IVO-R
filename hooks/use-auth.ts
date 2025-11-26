"use client";

import { Session } from "next-auth";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<null | Session>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const isSeller = session?.user?.role === "seller";
  const isCustomer = session?.user?.role === "customer";
  useEffect(() => {
    (async () => {
      const session = await getSession()
      if (session) {
        setSession(session)
        setIsAuthenticated(true)
      }
    })()
  }, [])
  // Login for customers
  const login = async (email: string, password: string, redirect?: boolean) => {
    setIsLoading(true);
    try {
      const result = await signIn("customer-login", {
        email,
        password,
        redirect: false,
      });

      setIsLoading(false);

      if (result?.error) {
        return { success: false, error: result.error };
      }

      // Update the session
      const session = await getSession()
      alert(JSON.stringify(session))
      console.log(session, "main")
      setSession(session)
      setIsAuthenticated(session ? true : false)
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
  const loginSeller = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await signIn("seller-login", {
        email,
        password,
        redirect: false,
      });

      setIsLoading(false);

      if (result?.error) {
        return { success: false, error: result.error };
      }

      // Update the session
      const session = await getSession()
      setSession(session)
      setIsAuthenticated(session ? true : false)

      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      setIsLoading(false);
      const session = await getSession()
      setSession(session)
      setIsAuthenticated(false)
      router.push("/");
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      console.error("Logout error:", error);
    }
  };

  return {
    session,
    user: session?.user,
    status: isAuthenticated ? "authenticated" : "unauthenticated",
    isLoading,
    isAuthenticated,
    isSeller,
    isCustomer,
    login,
    loginSeller,
    logout,
  };
}
