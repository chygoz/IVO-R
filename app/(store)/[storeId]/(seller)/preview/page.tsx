"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { StoreTheme } from "@/components/theme-preview/theme-selector";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { getLayoutComponent } from "@/components/store/templates";
import { getTemplateComponent } from "@/components/store/templates/page-index";
import { StoreProvider } from "@/lib/store-context";
import { CartProvider } from "@/providers/cart-provider";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const [theme, setTheme] = useState<StoreTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const themeParam = searchParams.get("theme");
      if (!themeParam) {
        setError("No theme data provided");
        setLoading(false);
        return;
      }

      const decodedTheme = JSON.parse(
        decodeURIComponent(themeParam)
      ) as StoreTheme;
      setTheme(decodedTheme);

      // Simulate loading the template
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error("Error parsing theme data:", err);
      setError("Invalid theme data");
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !theme) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 max-w-md text-center px-4">
          <p className="text-lg text-red-500">{error || "Theme not found"}</p>
          <p className="text-muted-foreground">
            There was an error loading the theme preview. Please go back and try
            again.
          </p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Dynamically load the template based on the theme
  const LayoutComponent = getLayoutComponent(theme.template);
  const TemplateComponent = getTemplateComponent(theme.template);

  return (
    <StoreProvider store={theme}>
      <CartProvider storeId="">
        <LayoutComponent theme={theme}>
          <TemplateComponent store={theme} />

          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <Button
              variant="default"
              size="sm"
              onClick={() => window.history.back()}
              className="shadow-lg gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Settings
            </Button>
          </div>
        </LayoutComponent>
      </CartProvider>
    </StoreProvider>
  );
}
