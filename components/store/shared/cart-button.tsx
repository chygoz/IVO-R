"use client";

import { useEffect, useState } from "react";
import { CartButton } from "./header-components";
import { StoreTheme } from "@/lib/store-context";

interface ResponsiveCartButtonProps {
  theme: StoreTheme;
  className?: string;
  desktopMode?: "dropdown" | "sidebar";
  mobileMode?: "dropdown" | "sidebar";
}

export function ResponsiveCartButton({
  theme,
  className,
  desktopMode = "dropdown",
  mobileMode = "sidebar",
}: ResponsiveCartButtonProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const showDropdown = isMobile
    ? mobileMode === "dropdown"
    : desktopMode === "dropdown";

  return (
    <CartButton
      theme={theme}
      className={className}
      showDropdown={showDropdown}
    />
  );
}
