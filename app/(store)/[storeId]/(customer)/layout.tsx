"use client";
import StoreLayoutWrapper from "@/components/store/store-layout-wrapper";
import { useStore } from "@/contexts/reseller-store-context";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  const { store } = useStore();
  return <StoreLayoutWrapper store={store}>{children}</StoreLayoutWrapper>;
}
