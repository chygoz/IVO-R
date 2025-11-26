export type CustomerStatus = "Active" | "Blocked";

export type CustomerTransaction = {
  _id: string;
  transactionId: string;
  transactionReference: string;
  sourceId: string;
  sourceType: "user" | "business";
  destinationId: string;
  amount: number;
  currency: string;
  isNormalized?: boolean;
  transactionType: string;
  status: string;
  metadata: Record<string, any>;
  reversalFor?: string;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerPerformance = {
  totalSpending: number;
  totalOrders: number;
  completedOrders: number;
  canceledOrders: number;
};

export type CustomerAddress = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  formattedAddress: string;
};

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  businessId: string;
  userId?: string;
  createdAt?: Date;
  type: "user" | "guest";
  status: CustomerStatus;
  activeOrder: number;
  totalOrders: number;
  totalSpending: number;
  address?: CustomerAddress;
  billingAddress?: CustomerAddress;
  performance?: CustomerPerformance;
  transactions?: CustomerTransaction[];
};

export type FormattedCustomer = Customer;

export type CustomerListResponse = {
  success: boolean;
  message: string;
  data?: {
    results: FormattedCustomer[];
    count: number;
  };
};

export type CustomerDetailResponse = {
  success: boolean;
  message: string;
  data?: FormattedCustomer;
};

export type CustomerFilters = {
  status?: CustomerStatus | "All Status";
  business: string;
  search?: string;
  page: number;
  limit: number;
};
