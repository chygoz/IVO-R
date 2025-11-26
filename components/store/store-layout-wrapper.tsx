"use client";

import { StoreProvider } from "@/lib/store-context";
import { transformResellerToTheme } from "@/lib/reseller.utils";
import { CartProvider } from "@/providers/cart-provider";
import { getLayoutComponent } from "@/components/store/templates";
import { ResellersResponse } from "@/actions/resellers/types";

interface StoreLayoutProps {
  children: React.ReactNode;
  store: ResellersResponse;
}

export function StoreLayoutWrapper({ children, store }: StoreLayoutProps) {
  // Transform ResellersResponse to StoreTheme
  const storeTheme = transformResellerToTheme(store);

  // Get the appropriate layout component based on theme
  const LayoutComponent = getLayoutComponent("bold");

  return (
    <StoreProvider store={storeTheme}>
      <CartProvider storeId={store._id}>
        <LayoutComponent theme={storeTheme}>{children}</LayoutComponent>
      </CartProvider>
    </StoreProvider>
  );
}

export default StoreLayoutWrapper;
