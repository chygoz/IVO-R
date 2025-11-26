import { apiClient } from "@/lib/api/api-client";
import type {
  Customer,
  CustomerListResponse,
  CustomerDetailResponse,
  CustomerFilters,
  CustomerStatus,
  CustomerTransaction,
} from "../types/customer";
import { fetchAPI } from "./config";

const CUSTOMER_BASE_URL = "/api/v1/customers";

export const getCustomers = async (
  filters: CustomerFilters
): Promise<CustomerListResponse> => {
  try {
    const { status, search, page, limit, business } = filters;

    // Build query params
    const queryParams = new URLSearchParams();
    if (status && status !== "All Status") queryParams.append("status", status);
    if (search) queryParams.append("search", search);
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    const queryString = queryParams.toString();
    const url = `${CUSTOMER_BASE_URL}/business/${business}${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await apiClient.seller.get(url);

    if (!res.data) {
      throw new Error("failed to fetch customers");
    }

    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong fetching customers",
    };
  }
};

export const getCustomerById = async (
  id: string
): Promise<CustomerDetailResponse> => {
  try {
    const res = await fetchAPI({
      url: `${CUSTOMER_BASE_URL}/${id}`,
    });

    if (res.error) {
      throw new Error(res.details);
    }

    return res;
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.message || "Something went wrong fetching customer details",
    };
  }
};

export const updateCustomerStatus = async (
  id: string,
  status: CustomerStatus
): Promise<CustomerDetailResponse> => {
  try {
    const res = await fetchAPI({
      url: `${CUSTOMER_BASE_URL}/${id}/status`,
      method: "PATCH",
      body: { status },
    });

    if (res.error) {
      throw new Error(res.details);
    }

    return res;
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.message || "Something went wrong updating customer status",
    };
  }
};

export const getCustomerTransactions = async (
  id: string,
  page: number = 1,
  limit: number = 10,
  dateRange?: { from: string; to: string },
  status?: string
): Promise<{
  success: boolean;
  data?: CustomerTransaction[];
  count?: number;
  message: string;
}> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (dateRange?.from && dateRange?.to) {
      queryParams.append("from", dateRange.from);
      queryParams.append("to", dateRange.to);
    }

    if (status) queryParams.append("status", status);

    const url = `${CUSTOMER_BASE_URL}/${id}/transactions?${queryParams.toString()}`;

    const res = await fetchAPI({
      url,
    });

    if (res.error) {
      throw new Error(res.details);
    }

    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong fetching transactions",
    };
  }
};

export const updateCustomer = async (
  id: string,
  data: Partial<Customer>
): Promise<CustomerDetailResponse> => {
  try {
    const res = await fetchAPI({
      url: `${CUSTOMER_BASE_URL}/${id}`,
      method: "PUT",
      body: data,
    });

    if (res.error) {
      throw new Error(res.details);
    }

    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong updating customer",
    };
  }
};
