import { Price, Variant } from "@/actions/types";
import { Item } from "@/contexts/cart/cart.utils";
export interface Item {
  id: string | number;
  variant: Variant;
  price: Price | null;
  product: Product;
  quantity: number;
  [key: string]: any;
}

export interface IOrderProgress {
  progressDate: Date;
  activity: string;
  status: string;
}
export interface IShipping {
  senderName?: string;
  senderPhone?: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  receiverCity: string;
  zip: string;
  receiverAddress: string;
  receiverCountry: string;
  receiverState: string;
}
// types/orders.ts
export interface Price {
  currency: string;
  value: string;
}

export interface TrackingInfo {
  trackingId: string;
  trackingUrl: string;
  carrier: string;
}

export interface ProgressStep {
  status: string;
  timestamp: Date;
  message: string;
  trackingInfo?: TrackingInfo;
}

export interface ContactInfo {
  email: string;
  name: string;
  phone: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  email: string,
  state: string;
  zip: string;
  country: string;
  phone: string;
  _id: {
    $oid: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface VariantGallery {
  url: string;
  mode: string;
  type: string;
  view: string;
  _id: {
    $oid: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface VariantSize {
  name: string;
  code: string;
  displayName: string;
  sortOrder: number;
}

export interface VariantColor {
  name: string;
  code: string;
  hex: string;
}

export interface Variant {
  gallery: VariantGallery[];
  size: VariantSize;
  color: VariantColor;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: Price;
  variant: Variant;
  name: string;
  _id: string;
  addedAt: Date;
}

export interface GatewayFee {
  transactionFee: number;
  platformFee: number;
  total: number;
}

export interface FeeBreakdown {
  gatewayFee: GatewayFee;
  isInternational: boolean;
  deliveryCost: number;
  resellerId: string;
  resellerType: string;
  subscriptionFee: number;
  subtotal: number;
  total: number;
}

export interface IOrder {
  _id: string;
  orderId: string;
  totalPrice: Price & {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  };
  business: string;
  customer: string;
  customerType: string;
  orderProgress: ProgressStep[];
  contactInfo: ContactInfo;
  orderDate: Date;
  shipping: ShippingInfo;
  deliveryDate: Date;
  items: OrderItem[];
  paymentStatus: string;
  idempotencyKey: string;
  deliveryCost: Price & {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  feeBreakdown: FeeBreakdown;
  paymentId: string;
  shipmentTrackingId?: string;
}
