"use client";

import { apiClient } from "./api-client";
import { FetchOptions } from "./api-actions";
import { useMemo } from "react";

export function useApiClient() {
  return useMemo(
    () => ({
      get: (endpoint: string, options: FetchOptions = {}) => {
        return apiClient.get(endpoint, options);
      },

      post: apiClient.post,
      put: (endpoint: string, body: any, options: FetchOptions = {}) => {
        return apiClient.put(endpoint, body, options);
      },
      patch: (endpoint: string, body: any, options: FetchOptions = {}) => {
        return apiClient.patch(endpoint, body, options);
      },
      delete: (endpoint: string, options: FetchOptions = {}) => {
        return apiClient.delete(endpoint, options);
      },
      form: apiClient.form,

      seller: {
        get: (endpoint: string, options: FetchOptions = {}) => {
          return apiClient.seller.get(endpoint, options);
        },
        post: apiClient.seller.post,
        put: (endpoint: string, body: any, options: FetchOptions = {}) => {
          return apiClient.seller.put(endpoint, body, options);
        },
        patch: (endpoint: string, body: any, options: FetchOptions = {}) => {
          return apiClient.seller.patch(endpoint, body, options);
        },
        delete: (endpoint: string, options: FetchOptions = {}) => {
          return apiClient.seller.delete(endpoint, options);
        },
        form: apiClient.seller.form,
      },
    }),
    []
  );
}
