"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { debounce } from "lodash";
import { syncProductToAPI } from "@/lib/api/product-sync";
import { useApiClient } from "@/lib/api/use-api-client";

export const useFormSync = (productId: string, initialData: any) => {
  const [formHasChanges, setFormHasChanges] = useState(false);
  const [apiSyncStatus, setApiSyncStatus] = useState<
    "idle" | "syncing" | "synced" | "error"
  >("idle");
  const [formProgress, setFormProgress] = useState(0);
  const [currentData, setCurrentData] = useState(initialData);

  // Get the API client
  const apiClient = useApiClient();

  const formDataRef = useRef(initialData);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const lastProgressValueRef = useRef<number>(0);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingChangeRef = useRef(false);

  useEffect(() => {
    if (
      initialData &&
      JSON.stringify(initialData) !== JSON.stringify(formDataRef.current)
    ) {
      formDataRef.current = initialData;
      setCurrentData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Only set up sync if we have all required dependencies
    if (productId && formHasChanges && apiClient) {
      const syncInterval = 0.2 * 60 * 1000; // 12 seconds for testing

      syncTimeoutRef.current = setTimeout(async () => {
        if (apiSyncStatus === "syncing") return;

        try {
          setApiSyncStatus("syncing");
          const result = await syncProductToAPI(
            productId,
            formDataRef.current,
            apiClient
          );
          setApiSyncStatus(result ? "synced" : "error");

          if (result) {
            setFormHasChanges(false);
          }
        } catch (error) {
          console.error("Error syncing to API:", error);
          setApiSyncStatus("error");
        }
      }, syncInterval);
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [productId, formHasChanges, apiSyncStatus, apiClient]);

  const debouncedUpdate = useCallback(
    debounce((data: any, progress: number) => {
      formDataRef.current = data;
      setCurrentData(data);

      if (progress !== lastProgressValueRef.current) {
        lastProgressValueRef.current = progress;
        setFormProgress(progress);
      }

      setFormHasChanges(true);
      isProcessingChangeRef.current = false;
    }, 1000),
    []
  );

  const handleFormChange = useCallback(
    (data: any, progress: number) => {
      if (isProcessingChangeRef.current || !productId) return;

      const dataString = JSON.stringify(data);
      if (dataString === JSON.stringify(formDataRef.current)) return;

      isProcessingChangeRef.current = true;
      debouncedUpdate(data, progress);
      lastUpdateTimeRef.current = Date.now();
    },
    [productId, debouncedUpdate]
  );

  const syncToAPI = useCallback(
    async (data: any) => {
      if (!productId || !apiClient) return false;

      try {
        setApiSyncStatus("syncing");
        const result = await syncProductToAPI(productId, data, apiClient);
        setApiSyncStatus(result ? "synced" : "error");

        if (result) {
          formDataRef.current = data;
          setCurrentData(data);
          setFormHasChanges(false);
        }

        return result;
      } catch (error) {
        console.error("Error syncing to API:", error);
        setApiSyncStatus("error");
        return false;
      }
    },
    [productId, apiClient]
  );

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  return {
    handleFormChange,
    formHasChanges,
    setFormHasChanges,
    apiSyncStatus,
    setApiSyncStatus,
    formProgress,
    currentData,
    syncToAPI,
  };
};
