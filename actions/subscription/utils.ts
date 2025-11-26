export interface Subscription {
    _id: string;
    businessId: string;
    planId: Plan
    planCode: string;
    storeName: string;
    storeUrl: string;
    status: 'active' | 'inactive' | 'expired' | string;
    startDate: string; // ISO date string
    endDate: string;   // ISO date string
    renewalDate: string; // ISO date string
    isAutoRenew: boolean;
    price: number;
    currency: string;
    payments: Payment;
    customFeatures: Record<string, any>;
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


export interface Payment {
    paymentId: string;
    paymentPlan: string
    amount: string;
    paymentMethod: string;
    paymentDate: string; // ISO
    status: string;
    invoice: string;
    currency: string;
    [key: string]: any;
}

export interface AddPayment {
    payment: {
        paymentId: string,
        amount: number,
        currency: string,
        status: string,
        paymentMethod: string,
        paymentDate: string
    }
}

interface FeatureDetail {
    enabled: boolean;
    limit?: number | string;
    [key: string]: any;
}

interface PlanFeatures {
    whiteLabeling: FeatureDetail;
    productLimit: FeatureDetail;
    collectionLimit: FeatureDetail;
    piecesPerCollectionLimit: FeatureDetail;
    salesReporting: FeatureDetail;
    customerSupport: FeatureDetail;
    paymentCurrencies: FeatureDetail;
    settlementCurrencies: FeatureDetail;
}

interface Plan {
    _id: string;
    name: string;
    code: string;
    price: number;
    currency: string;
    features: PlanFeatures;
}
