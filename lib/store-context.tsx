"use client";

import { createContext, useContext, ReactNode } from "react";

export interface StoreTheme {
  template: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  logo?: string;
  name: string;
  id: string;
  headline?: string;
  subtext?: string;
  banner?: string;
  domain?: string;
  storeId?: string; // The subdomain/slug used for routing
  settings?: {
    currency: string;
    showPrices: boolean;
    showStock: boolean;
  };
}

interface StoreContextType {
  store: StoreTheme;
  storeId: string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  store: StoreTheme;
  children: ReactNode;
}

export function StoreProvider({ store, children }: StoreProviderProps) {
  return (
    <StoreContext.Provider value={{ store, storeId: store.storeId || "" }}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}

// Helper function to transform ResellersResponse to StoreTheme
