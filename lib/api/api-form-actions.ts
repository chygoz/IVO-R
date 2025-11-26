"use server";

import { auth } from "@/auth";

const API_URL = process.env.SERVER_API_URL;

if (!API_URL) {
  throw new Error("API_URL environment variable is not set");
}

export type FormDataFetchOptions = {
  requireAuth?: boolean;
  requireBusiness?: boolean;
  customHeaders?: Record<string, string>;
  cache?: RequestCache;
  revalidate?: number | false;
};

export type FormDataRequestOptions = {
  method?: string;
  formData: FormData;
} & FormDataFetchOptions;

/**
 * Special API request function specifically for handling FormData uploads
 * This function doesn't set Content-Type header, allowing the browser to set it automatically
 * with the correct boundary for multipart/form-data
 */
export async function formDataApiRequest(
  endpoint: string,
  options: FormDataRequestOptions
) {
  const {
    method = "POST", // Default to POST for FormData
    formData,
    requireAuth = true,
    requireBusiness = false,
    customHeaders = {},
    cache = "no-store",
    revalidate,
  } = options;

  const headers: Record<string, string> = {
    ...customHeaders,
  };

  // Note: We intentionally don't set Content-Type header
  // The browser will automatically set it to multipart/form-data with the correct boundary

  // Get session server-side
  if (requireAuth) {
    const session = await auth();
    if (session?.user?.token) {
      headers["Authorization"] = `Bearer ${session.user.token}`;
    } else if (requireAuth) {
      throw new Error("Authentication required");
    }

    // Add business key for seller requests
    if (requireBusiness) {
      if (session?.user?.businessId) {
        headers["x-business-key"] = session.user.businessId;
      } else {
        throw new Error("Business access required");
      }
    }
  }

  // Build request options
  const requestOptions: RequestInit = {
    method,
    headers,
    cache,
    body: formData, // Pass FormData directly as the body, without JSON.stringify
  };

  // Set revalidation if specified
  if (revalidate !== undefined) {
    requestOptions.next = { revalidate };
  }

  // Make the API call
  console.log("req", requestOptions);
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  const response = await fetch(url, requestOptions);

  // Handle non-JSON responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();

    // If response is not successful, throw an error
    if (!response.ok) {
      throw new Error(
        data.message || `API request failed with status ${response.status}`
      );
    }

    return data;
  } else {
    // Handle non-JSON responses (like file downloads)
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response;
  }
}
