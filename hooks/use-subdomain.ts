// hooks/use-subdomain.ts
"use client";

import { useState, useEffect } from "react";

export function useSubdomain() {
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");

      if (parts.length > 1 && !hostname.startsWith("localhost")) {
        setSubdomain(parts[0]);
      }
    }
  }, []);

  return subdomain;
}
