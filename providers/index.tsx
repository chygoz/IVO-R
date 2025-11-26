"use client";
import { LoginModal } from "@/components/auth/login-modal";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { PaymentProvider } from "./payment-provider";
import QueryProvider from "./tansack.provider";
import { NotificationProvider } from "./notification-provider";

type ProvidersProps = {
  children: React.ReactNode;
  initialUser: any;
  session: Session | null;
};

function Providers({ children, initialUser, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <QueryProvider>
        <AuthProvider initialUser={initialUser} session={session}>
          <NotificationProvider>
            <PaymentProvider>
              <Toaster />
              {children}
              <LoginModal />
            </PaymentProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryProvider>
    </SessionProvider>
  );
}

export default Providers;
