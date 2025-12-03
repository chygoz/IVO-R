"use client";
import { ResellersResponse } from "@/actions/resellers/types";
import React, { createContext, useContext, ReactNode } from "react";

interface StoreContextType {
  store: ResellersResponse;
  isLoading: boolean;
  storeId: string; // The subdomain/slug used for routing
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  store: ResellersResponse;
  children: ReactNode;
}

export const ResellerStoreProvider: React.FC<StoreProviderProps> = ({
  store,
  children,
}) => {
  const value = React.useMemo(
    () => ({
      store,
      isLoading: false,
      storeId: store.subdomain || store.storefront?.domain?.subdomain || store.slug || "",
    }),
    [store]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw new Error("useStore must be used within a ResellerStoreProvider");
  }

  return context;
};
