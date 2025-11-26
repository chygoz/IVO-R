"use client";

import { useState, useEffect } from "react";
import { getResellerBySubdomain } from "@/actions/resellers";
import { useSubdomain } from "./use-subdomain";
import { ResellersResponse } from "@/actions/resellers/types";

export function useStoreLoading() {
  const [store, setStore] = useState<ResellersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const subdomain = useSubdomain();

  useEffect(() => {
    async function fetchStore() {
      if (!subdomain) {
        setLoading(false);
        return;
      }

      try {
        const storeData = await getResellerBySubdomain(subdomain);
        setStore(storeData);
      } catch (error) {
        console.log("Store not found");
      } finally {
        setLoading(false);
      }
    }

    fetchStore();
  }, [subdomain]);

  return { store, loading: loading, subdomain };
}
