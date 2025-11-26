import "./globals.css";
import { inter } from "./font";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Providers from "@/providers";
import { auth } from "@/auth";
import Script from "next/script";
import { Suspense } from "react";

const APP_DESCRIPTION = "Resellers";

export const metadata: Metadata = {
  title: "Resellers",
  description: APP_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
    shortcut: "/shortcut-icon.png",
  },
};

async function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const initialUser = session?.user || null;

  return (
    <Providers session={session} initialUser={initialUser}>
      {children}
    </Providers>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={cn(
          "min-h-screen w-full bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          }
        >
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
      </body>
      <Script id="brevo-conversations" strategy="afterInteractive">
        {`
            (function(d, w, c) {
              w.BrevoConversationsID = '6834c7523f30146b4308ea1c';
              w[c] = w[c] || function() {
                  (w[c].q = w[c].q || []).push(arguments);
              };
              var s = d.createElement('script');
              s.async = true;
              s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
              if (d.head) d.head.appendChild(s);
            })(document, window, 'BrevoConversations');
          `}
      </Script>
    </html>
  );
}
