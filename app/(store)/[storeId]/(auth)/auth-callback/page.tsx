"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PROTOCOL } from "@/constants";
import { AuthUser } from "@/types/user";
import { removeDot } from "@/utils/remote-dot";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const storeId = searchParams.get("storeId") || "";

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const processAuth = async () => {
      try {
        // Wait a bit for the session to be established (next-auth might need time)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get the session from the server
        const response = await fetch("/api/auth/session", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to get session");
        }

        const session = await response.json();

        if (!session?.user) {
          // If session isn't available yet, try again after a delay
          timeoutId = setTimeout(processAuth, 1000);
          return;
        }

        const user = session.user as AuthUser;

        // Now we can process the user like authenticateUser would
        if (user.role === "seller") {
          // Check if onboarding is needed
          if (user?.onboardingStatus && !user.onboardingStatus.completed) {
            // Redirect to appropriate onboarding step on main domain
            const mainDomain = removeDot(
              process.env.NEXT_PUBLIC_ROOT_DOMAIN || "resellerivo.com"
            );
            window.location.href = `${PROTOCOL}://${user.subdomain}.${mainDomain}/onboarding/${user.onboardingStatus.currentStep}`;
            return;
          }

          // Check if seller owns this store
          if (storeId && user.businessId !== storeId) {
            // Redirect to their own store's subdomain
            const mainDomain = removeDot(
              process.env.NEXT_PUBLIC_ROOT_DOMAIN || "resellerivo.com"
            );
            window.location.href = `${PROTOCOL}://${user.subdomain}.${mainDomain}/dashboard`;
            return;
          }

          // Admins go to admin, others to dashboard
          if ((user as any).businessRole === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        } else {
          // For customers, redirect to the callback URL
          router.push(callbackUrl);
        }

        router.refresh();
      } catch (error) {
        console.error("Auth callback error:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Authentication process failed"
        );

        // Redirect back to login after a delay if there's an error
        timeoutId = setTimeout(() => {
          router.push(
            `/login?error=${encodeURIComponent(
              error instanceof Error ? error.message : "Authentication failed"
            )}`
          );
        }, 2000);
      }
    };

    processAuth();

    // Cleanup timeout if component unmounts
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [callbackUrl, router, storeId]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mb-4"
          >
            {error}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative mb-8">
              <motion.div
                className="w-16 h-16 rounded-full border-t-2 border-b-2 border-primary"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
