"use client";
import { StoreTheme } from "@/lib/store-context";
import { LoadingTemplate } from "@/components/store/loading-template";
import dynamic from "next/dynamic";

type LayoutComponent = React.ComponentType<{
  children: React.ReactNode;
  theme: StoreTheme;
}>;

// Use a different approach to dynamic imports
export const getLayoutComponent = (template: string): LayoutComponent => {
  switch (template) {
    case "minimal":
      return dynamic(
        () => import("@/components/store/templates/minimal/layout"),
        { loading: () => <LoadingTemplate />, ssr: false }
      );
    case "luxury":
      return dynamic(
        () => import("@/components/store/templates/luxury/layout"),
        { loading: () => <LoadingTemplate />, ssr: false }
      );
    case "modern":
      return dynamic(
        () => import("@/components/store/templates/modern/layout"),
        { loading: () => <LoadingTemplate />, ssr: false }
      );
    case "classic":
      return dynamic(
        () => import("@/components/store/templates/classical/layout"),
        { loading: () => <LoadingTemplate />, ssr: false }
      );
    case "bold":
      return dynamic(() => import("@/components/store/templates/bold/layout"), {
        loading: () => <LoadingTemplate />,
        ssr: false,
      });
    default:
      return dynamic(
        () => import("@/components/store/templates/luxury/layout"),
        { loading: () => <LoadingTemplate />, ssr: false }
      );
  }
};
