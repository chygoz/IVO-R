export interface PlanFeature<T> {
    type: 'boolean' | 'number' | 'array';
    value: T;
    description: string;
  }
  
  export interface PlanFeatures {
    whiteLabeling: PlanFeature<boolean>;
    productLimit: PlanFeature<number | null>;
    collectionLimit: PlanFeature<number | null>;
    piecesPerCollectionLimit: PlanFeature<number | null>;
    salesReporting: PlanFeature<boolean>;
    customerSupport: PlanFeature<boolean>;
    paymentCurrencies: PlanFeature<string[]>;
    settlementCurrencies: PlanFeature<string[]>;
  }
  
  export interface PlanMetadata {
    displayOrder: number;
    recommendedFor: string;
    popularChoice: boolean;
  }
  
  export interface PlanItem {
    _id: string;
    name: string;
    code: string;
    price: number;
    currency: string;
    billingCycle: 'monthly' | 'yearly' | string;
    features: PlanFeatures;
    additionalFeatures: Record<string, unknown>;
    metadata: PlanMetadata;
    isActive: boolean;
    __v: number;
    createdAt: string; // could use Date if you're parsing it
    updatedAt: string;
  }
  
  export interface PlanData {
    plans: PlanItem[];
    total: number;
    totalPages: number | null;
  }
  
  export interface GetPlansAPIResponse {
    success: boolean;
    message: string;
    data: PlanData;
  }

  export interface PaymentResponse {
    payment: {
      paymentId: string
      amount: number
      currency: string
      status: 'pending' | 'completed' | 'failed' // You can extend this union type as needed
      paymentMethod: 'transfer' | 'card' | 'ussd' | string // Add other methods if applicable
      paymentDate: string // ISO date string
    }
  }
  
  