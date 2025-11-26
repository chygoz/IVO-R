export interface FeatureValue {
  type: "boolean" | "number" | "array" | string;
  value: boolean | number | string[] | null;
  description: string;
}

export interface Features {
  [key: string]: FeatureValue;
}

export interface PlanMetadata {
  displayOrder?: number;
  recommendedFor?: string;
  popularChoice?: boolean;
}

export interface Plan {
  _id: string;
  name: string;
  code: string;
  price: number;
  currency: string;
  billingCycle: string;
  features: Features;
  additionalFeatures?: Record<string, any>;
  metadata?: PlanMetadata;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Payment {
  id?: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  transactionId?: string;
  planName?: string;
  periodStart?: string;
  periodEnd?: string;
}

export type SubscriptionStatus =
  | "active"
  | "expired"
  | "pending"
  | "cancelled"
  | "inactive";

export interface Subscription {
  _id: string;
  businessId: string;
  planId: Plan;
  planCode: string;
  storeName: string;
  storeUrl: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  renewalDate: string;
  isAutoRenew: boolean;
  price: number;
  currency: string;
  payments: Payment[];
  customFeatures?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
