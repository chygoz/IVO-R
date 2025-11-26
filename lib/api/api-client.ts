import SecureStorage from "../auth/secure-storage";
import { FetchOptions, RequestOptions, apiRequest } from "./api-actions";
import { FormDataFetchOptions, formDataApiRequest } from "./api-form-actions";

// Client-side imports (will be tree-shaken on server)
let useAuth: any = null;
let getClientAuth: () => Promise<{ user: any } | null> = async () => null;

// Dynamic import for client-side only
if (typeof window !== "undefined") {
  import("@/contexts/auth-context").then((module) => {
    useAuth = module.useAuth;
  });

  getClientAuth = async () => {
    if (typeof window === "undefined" || !useAuth) return null;
    return null;
  };
}

// Client-side GET request handler (your existing implementation)
async function clientGet(
  endpoint: string,
  options: FetchOptions = {}
): Promise<any> {
  const {
    requireAuth = true,
    requireBusiness = false,
    customHeaders = {},
    cache = "no-store",
    params,
  } = options;

  const authData = SecureStorage.getAuthData();

  if (requireAuth && !authData?.token) {
    throw new Error("Authentication required");
  }

  if (requireBusiness && !authData?.businessId) {
    throw new Error("Business access required");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (authData?.token) {
    headers["Authorization"] = `Bearer ${authData.token}`;
  }

  if (requireBusiness && authData?.businessId) {
    headers["x-business-key"] = authData.businessId;
  }

  // Build URL with query parameters
  let url = endpoint.startsWith("http")
    ? endpoint
    : `${process.env.NEXT_PUBLIC_SERVER_API_URL}${endpoint}`;

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

  const response = await fetch(url, {
    method: "GET",
    headers,
    cache,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}

// Client-side POST request handler
async function clientPost(
  endpoint: string,
  body: any,
  options: FetchOptions = {}
): Promise<any> {
  const {
    requireAuth = true,
    requireBusiness = false,
    customHeaders = {},
  } = options;

  const authData = SecureStorage.getAuthData();

  if (requireAuth && !authData?.token) {
    throw new Error("Authentication required");
  }

  if (requireBusiness && !authData?.businessId) {
    throw new Error("Business access required");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (authData?.token) {
    headers["Authorization"] = `Bearer ${authData.token}`;
  }

  if (requireBusiness && authData?.businessId) {
    headers["x-business-key"] = authData.businessId;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${process.env.NEXT_PUBLIC_SERVER_API_URL}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}
// Client-side PUT request handler
async function clientPut(
  endpoint: string,
  body: any,
  options: FetchOptions = {}
): Promise<any> {
  const {
    requireAuth = true,
    requireBusiness = false,
    customHeaders = {},
  } = options;

  const authData = SecureStorage.getAuthData();

  if (requireAuth && !authData?.token) {
    throw new Error("Authentication required");
  }

  if (requireBusiness && !authData?.businessId) {
    throw new Error("Business access required");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (authData?.token) {
    headers["Authorization"] = `Bearer ${authData.token}`;
  }

  if (requireBusiness && authData?.businessId) {
    headers["x-business-key"] = authData.businessId;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${process.env.NEXT_PUBLIC_SERVER_API_URL}${endpoint}`;

  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}

// Client-side PATCH request handler
async function clientPatch(
  endpoint: string,
  body: any,
  options: FetchOptions = {}
): Promise<any> {
  const {
    requireAuth = true,
    requireBusiness = false,
    customHeaders = {},
  } = options;

  const authData = SecureStorage.getAuthData();

  if (requireAuth && !authData?.token) {
    throw new Error("Authentication required");
  }

  if (requireBusiness && !authData?.businessId) {
    throw new Error("Business access required");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (authData?.token) {
    headers["Authorization"] = `Bearer ${authData.token}`;
  }

  if (requireBusiness && authData?.businessId) {
    headers["x-business-key"] = authData.businessId;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${process.env.NEXT_PUBLIC_SERVER_API_URL}${endpoint}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}

// Client-side DELETE request handler
async function clientDelete(
  endpoint: string,
  options: FetchOptions = {}
): Promise<any> {
  const {
    requireAuth = true,
    requireBusiness = false,
    customHeaders = {},
  } = options;

  const authData = SecureStorage.getAuthData();

  if (requireAuth && !authData?.token) {
    throw new Error("Authentication required");
  }

  if (requireBusiness && !authData?.businessId) {
    throw new Error("Business access required");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (authData?.token) {
    headers["Authorization"] = `Bearer ${authData.token}`;
  }

  if (requireBusiness && authData?.businessId) {
    headers["x-business-key"] = authData.businessId;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${process.env.NEXT_PUBLIC_SERVER_API_URL}${endpoint}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}

// Main API client with integrated server/client routing
export const apiClient = {
  /**
   * Make an authenticated API request - server-side only
   */
  fetch: async (
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<any> => {
    return apiRequest(endpoint, options);
  },

  // GET method - routes to client-side when in browser
  get: async (endpoint: string, options: FetchOptions = {}): Promise<any> => {
    if (typeof window !== "undefined") {
      return clientGet(endpoint, options);
    }
    return apiClient.fetch(endpoint, { ...options, method: "GET" });
  },

  // Server-side POST
  post: async (
    endpoint: string,
    body: any,
    options: FetchOptions = {}
  ): Promise<any> => {
    if (typeof window !== "undefined") {
      return clientPost(endpoint, body, options);
    }
    return apiClient.fetch(endpoint, { ...options, method: "POST", body });
  },

  // Client-side PUT
  put: async (
    endpoint: string,
    body: any,
    options: FetchOptions = {}
  ): Promise<any> => {
    if (typeof window !== "undefined") {
      return clientPut(endpoint, body, options);
    }
    return apiClient.fetch(endpoint, { ...options, method: "PUT", body });
  },

  // Client-side PATCH
  patch: async (
    endpoint: string,
    body: any,
    options: FetchOptions = {}
  ): Promise<any> => {
    if (typeof window !== "undefined") {
      return clientPatch(endpoint, body, options);
    }
    return apiClient.fetch(endpoint, { ...options, method: "PATCH", body });
  },

  // Client-side DELETE
  delete: async (
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<any> => {
    if (typeof window !== "undefined") {
      return clientDelete(endpoint, options);
    }
    return apiClient.fetch(endpoint, { ...options, method: "DELETE" });
  },

  /**
   * Form data API methods for multipart/form-data requests (keep server-side)
   */
  form: {
    post: async (
      endpoint: string,
      formData: FormData,
      options: FormDataFetchOptions = {}
    ) => {
      return formDataApiRequest(endpoint, {
        method: "POST",
        formData,
        ...options,
      });
    },

    put: async (
      endpoint: string,
      formData: FormData,
      options: FormDataFetchOptions = {}
    ) => {
      return formDataApiRequest(endpoint, {
        method: "PUT",
        formData,
        ...options,
      });
    },

    patch: async (
      endpoint: string,
      formData: FormData,
      options: FormDataFetchOptions = {}
    ) => {
      return formDataApiRequest(endpoint, {
        method: "PATCH",
        formData,
        ...options,
      });
    },
  },

  // Special methods for seller API calls
  seller: {
    get: async (endpoint: string, options: FetchOptions = {}): Promise<any> => {
      return apiClient.get(endpoint, { ...options, requireBusiness: true });
    },

    post: async (
      endpoint: string,
      body: any,
      options: FetchOptions = {}
    ): Promise<any> => {
      return apiClient.post(endpoint, body, {
        ...options,
        requireBusiness: true,
      });
    },

    put: async (
      endpoint: string,
      body: any,
      options: FetchOptions = {}
    ): Promise<any> => {
      return apiClient.put(endpoint, body, {
        ...options,
        requireBusiness: true,
      });
    },

    patch: async (
      endpoint: string,
      body: any,
      options: FetchOptions = {}
    ): Promise<any> => {
      return apiClient.patch(endpoint, body, {
        ...options,
        requireBusiness: true,
      });
    },

    delete: async (
      endpoint: string,
      options: FetchOptions = {}
    ): Promise<any> => {
      return apiClient.delete(endpoint, {
        ...options,
        requireBusiness: true,
      });
    },

    /**
     * Form data API methods for seller multipart/form-data requests (keep server-side)
     */
    form: {
      post: async (
        endpoint: string,
        formData: FormData,
        options: FormDataFetchOptions = {}
      ) => {
        return apiClient.form.post(endpoint, formData, {
          ...options,
          requireBusiness: true,
        });
      },

      put: async (
        endpoint: string,
        formData: FormData,
        options: FormDataFetchOptions = {}
      ) => {
        return formDataApiRequest(endpoint, {
          method: "PUT",
          formData,
          requireBusiness: true,
          ...options,
        });
      },

      patch: async (
        endpoint: string,
        formData: FormData,
        options: FormDataFetchOptions = {}
      ) => {
        return formDataApiRequest(endpoint, {
          method: "PATCH",
          formData,
          requireBusiness: true,
          ...options,
        });
      },
    },
  },
};
