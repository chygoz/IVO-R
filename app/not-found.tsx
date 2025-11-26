"use client";
import { GenericNotFound } from "@/components/store/generic-not-found";
import { StoreNotFound } from "@/components/store/store-not-found";
import { useStore404 } from "@/hooks/use-store-404";
import { transformResellerToTheme } from "@/lib/reseller.utils";
import { StoreProvider } from "@/lib/store-context";
import { CartProvider } from "@/providers/cart-provider";

export default function NotFoundPage() {
  const { store, loading } = useStore404();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (store) {
    const storeTheme = transformResellerToTheme(store);
    return (
      <StoreProvider store={storeTheme}>
        <CartProvider storeId={store._id}>
          <StoreNotFound />
        </CartProvider>
      </StoreProvider>
    );
  }

  return <GenericNotFound />;
}
