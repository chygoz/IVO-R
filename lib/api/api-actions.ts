"use server";
import { auth } from "@/auth";
import { CookieManager, CookieForwardingOptions } from "./cookie-manager";

const API_URL = process.env.SERVER_API_URL;

if (!API_URL) {
  throw new Error("API_URL environment variable is not set");
}

export type FetchOptions = {
  includeAuthHeaders?: boolean;
  requireAuth?: boolean;
  requireBusiness?: boolean;
  customHeaders?: Record<string, string>;
  cache?: RequestCache;
  revalidate?: number | false;
  includeContentType?: boolean;
  params?: Record<string, string | number | boolean | undefined | null>;
} & CookieForwardingOptions;

export type RequestOptions = {
  method?: string;
  body?: any;
} & FetchOptions;

// export type ApiResponse<T = any> = {
//   success?: boolean;
//   data?: T;
//   error?: any;
//   message?: string;
//   response: Response;
//   setCookieHeaders: string[];
// };

export async function apiRequest(
  endpoint: string,
  options: RequestOptions = {}
) {
  const {
    method = "GET",
    body,
    requireAuth = true,
    requireBusiness = false,
    customHeaders = {},
    cache = "no-store",
    revalidate,
    includeContentType = true,
    params,
    forwardCookies = true,
    cookiesToForward = ["cartId"],
    includeCookieHeaders = true,
    includeAuthHeaders = false,
  } = options;

  const headers: Record<string, string> = {
    ...customHeaders,
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  // Handle cookie forwarding
  if (forwardCookies && includeCookieHeaders) {
    const cookieHeader = await CookieManager.getForwardingCookies(
      cookiesToForward
    );
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }
  }

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
  } else if (includeAuthHeaders) {
    const session = await auth();
    if (session?.user?.token) {
      headers["Authorization"] = `Bearer ${session.user.token}`;
    }
  }

  // Build request options
  const requestOptions: RequestInit = {
    method,
    headers,
    cache,
  };

  // Set revalidation if specified
  if (revalidate !== undefined) {
    requestOptions.next = { revalidate };
  }

  // Add body for non-GET requests
  if (method !== "GET" && body) {
    requestOptions.body = includeContentType ? JSON.stringify(body) : body;
  }

  // Build URL with query parameters if provided
  let url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  // Append query parameters if they exist
  if (params && Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    if (queryString) {
      url += url.includes("?") ? `&${queryString}` : `?${queryString}`;
    }
  }

  // Make the API call
  const response = await fetch(url, requestOptions);

  // Extract Set-Cookie headers
  const setCookieHeaders = CookieManager.extractSetCookieHeaders(response);

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

    return {
      ...data,
      response,
      setCookieHeaders,
    };
  } else {
    // Handle non-JSON responses (like file downloads)
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return {
      data: response,
      response,
      setCookieHeaders,
    };
  }
}
