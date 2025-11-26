import React from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import WalletHeader from "@/components/wallet/wallet-header";
import { Toaster } from "@/components/ui/toaster";
import { WalletProvider } from "@/hooks/use-wallet";

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock theme for development - in production this would come from your context
  const storeTheme = {
    template: "default",
    colors: {
      primary: "#000000",
      secondary: "#ffffff",
      accent: "#3b82f6",
      background: "#ffffff",
      text: "#000000",
    },
    logo: "/logo.svg",
    name: "IVO Stores",
    id: "12345",
  };

  return (
    <ThemeProvider theme={storeTheme}>
      <WalletProvider>
        <div className="flex flex-col min-h-screen bg-background">
          <main className="flex-grow container mx-auto px-4 py-6">
            {children}
          </main>
          <Toaster />
        </div>
      </WalletProvider>
    </ThemeProvider>
  );
}
