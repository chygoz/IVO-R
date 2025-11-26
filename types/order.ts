export interface Price {
  currency: "USD" | "NGN";
  value: string;
}

// Customer contact info
export interface ContactInfo {
  email: string;
  name: string;
  phone?: string;
}

// Product variant
export interface CartItemVariant {
  color?: {
    name: string;
    hex: string;
    code: string;
  };
  size?: {
    name: string;
    code: string;
    displayName: string;
    sortOrder: number;
  };
  gallery?: Array<{
    name: string;
    url: string;
    mode: "model" | "product";
    type: "full" | "half" | "close-up";
    view: "front" | "back" | "side" | "top" | "bottom";
  }>;
}

// Cart item structure
export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  quantity: number;
  price: Price;
  variant?: CartItemVariant;
  addedAt: string;
}

// Shipping address structure
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

// Progress status item
export interface OrderProgress {
  status:
  | "created"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "pickup_scheduled"
  | "pickup_cancelled";
  timestamp: string;
  message?: string;
  trackingInfo?: {
    trackingId?: string;
    trackingUrl?: string;
    carrier?: string;
  };
}

export type OrderStatusType =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

/**
 * Cancellation reason enum
 */
export enum CancellationReason {
  CUSTOMER_REQUEST = "customer_request",
  OUT_OF_STOCK = "out_of_stock",
  ADDRESS_ISSUE = "address_issue",
  PAYMENT_FAILED = "payment_failed",
  DELIVERY_CONSTRAINT = "delivery_constraint",
  BUSINESS_CLOSED = "business_closed",
  SYSTEM_ERROR = "system_error",
  OTHER = "other",
}

/**
 * Base cancellation interface
 */
export interface Cancellation {
  reason: CancellationReason;
  additionalInfo?: string;
  cancelledAt: string; // Changed from Date to string for consistency
  cancelledBy?: string;
  canReattempt: boolean;
}

/**
 * Shipment cancellation with shipment-specific fields
 */
export interface ShipmentCancellation extends Cancellation {
  refundDetails?: {
    refundId: string;
    amount: number;
    currency: string;
    refundedAt: string;
    status: "pending" | "completed" | "failed";
  };
}

/**
 * Pickup cancellation with pickup-specific fields
 */
export interface PickupCancellation extends Cancellation {
  canReschedule: boolean;
  cancellationFee?: number;
}

/**
 * Full order cancellation
 */
export interface OrderCancellation extends Cancellation {
  affectedItems?: string[];
  unaffectedItems?: string[];
  shouldRestockInventory: boolean;
  refundInfo?: {
    refundId: string;
    amount: number;
    currency: string;
    refundedAt: string;
    status: "pending" | "completed" | "failed";
  };
}

export interface ShipmentDetails {
  createdAt: Date;
  updatedAt?: Date;
  shippingDate: string;
  cancellation?: ShipmentCancellation;
  label: {
    imageFormat: "PDF" | "PNG" | "JPG";
    content: string;
    typeCode: "label";
    url?: string;
  };
  packageInfo: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    service: string;
  };
}

export interface PickupDetails {
  dispatchConfirmationNumber: string;
  scheduledPickupDateAndTime: string;
  status: "scheduled" | "completed" | "cancelled";
  location?: string;
  locationType?: "business" | "residence";
  specialInstructions?: string;
  cancelledAt?: string;
  closeTime?: string;
  cancellation?: PickupCancellation;
}

export interface OrderType {
  _id: string;
  orderId: string;
  totalPrice: Price;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  orderDate: string;
  status:
  | "created"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  items: CartItem[];
}

export interface OrderDetailType {
  _id: string;
  orderId: string;
  totalPrice: Price;
  business: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  customerType: "user" | "guest";
  orderProgress: OrderProgress[];
  orderStatus: OrderStatusType;
  cancellation?: OrderCancellation;
  contactInfo: ContactInfo;
  orderDate: string;
  shipping: ShippingAddress;
  deliveryDate: string;
  items: CartItem[];
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentId?: string;
  shipmentTrackingId?: string;
  shipmentDetails?: ShipmentDetails;
  pickupDetails?: PickupDetails;
  deliveryCost: Price;
  feeBreakdown?: {
    gatewayFee?: {
      transactionFee: number;
      platformFee: number;
      total: number;
    };
    isInternational?: boolean;
    deliveryCost?: number;
    resellerId?: string;
    resellerType?: "owner" | "reseller-internal" | "reseller-external";
    subscriptionFee?: number;
    planCharge?: number;
    subtotal: number;
    total: number;
  };
  notes?: Array<{
    content: string;
    createdBy: {
      _id: string;
      name: string;
    };
    createdAt: string;
  }>;
}

// Types for shipping label creation
export interface ShippingLabelFormData {
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderPostalCode: string;
  senderCountryCode: string;
  senderPhone: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  serviceType: string;
  shippingDate: string;
}

// Types for pickup scheduling
export interface PickupFormData {
  pickupDate: string;
  pickupTime: string;
  closeTime: string;
  location: string;
  locationType: "business" | "residence";
  specialInstructions: string;
}
