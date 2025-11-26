export interface Category {
  _id: string;
  name: string;
  slug: string;
  gallery: string[];
}

export interface Business {
  _id: string;
  name: string;
  slug: string;
}

export type Mode = "on-sale" | "pre-order" | "available";
export type Gender = "women" | "men";

export interface Gallery {
  url: string;
  mode: "model" | "product";
  type: "full" | "half" | "close-up";
  view: "front" | "side" | "back";
}

export interface Color {
  name: string;
  code: string;
  hex: string;
}
export interface Collection {
  _id: string;
  name: string;
  business: string;
  slug: string;
  description: string;
  products: [];
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionResponse {
  data: {
    results: Collection[];
  };
}

export interface CreationCollectionResponse {
  data: Collection;
}

export interface Size {
  name: string;
  code: string;
  displayName: string;
  sortOrder: number;
}

export interface Variant {
  sku: string;
  quantity: number;
  status: "in-stock" | "out-of-stock" | "limited-stock";
  gallery: Gallery[];
  active: boolean;
  size: Size;
  color: Color;
  _id?: string;
}

export interface Price {
  currency: "NGN" | "USD";
  value: string;
  _id: string;
}
export interface Product {
  _id: string;
  name: string;
  code: string;
  status: string;
  mode: Mode;
  slug: string;
  sizeFit: string;
  stockStatus: string;
  quantity: number;
  description: string;
  source: "product" | "blank";
  gender: Gender;
  category: Category;
  basePrice: Price;
  variants: Variant[];
  tags: [];
  business: Business;
  createdAt: Date;
}

export interface ProductsResponse {
  data: {
    results: Product[];
    metadata: Metadata;
  };
}

export type IShippingRegion = "us" | "africa" | "europe" | "nigeria";

export interface ShippingOption {
  productCode: string;
  productName: string;
  totalPrice: string;
  deliveryTime: string;
}

export interface UserShipping {
  _id?: number;
  firstName: string;
  lastName?: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip?: string;
  country: string;
  phone: string;
  type: "user" | "business";
  identifier: string;
  isDefault: boolean;
}

export interface CreateShipping {
  firstName: string;
  lastName?: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip?: string;
  country: string;
  phone: string;
  type: "user" | "business";
  identifier: string;
  isDefault: boolean;
}

export type Currency = "USD" | "NGN";
export interface CreateVariantInput {
  price?: Omit<Price, "_id">;
  quantity: number;
  color: {
    name: string; //"black";
    hex: string; // "#000";
    code: string; //"bl";
  };
  size: {
    name: string; //"M";
    code: string; //"MD";
    displayName: string; //"Medium";
    sortOrder: number; //1;
  };
  gallery: {
    type: string; //"full";
    view: string; //"front";
    mode: string; //"product";
    url: string; //"https://res.cloudinary.com/dqml918tz/image/upload/v1734692007/ivo-stores/ivo-stores/media/q2v5pg0pdcyizzxmwytx.png";
  }[];
}

export interface CreateProductInput {
  name: string;
  description: string;
  sizeFit: string;
  gender: "men" | "women" | "unisex";
  basePrice: Omit<Price, "_id">; //"200000";
  category: string; //"6764985145ea728e3b2bf76e";
  status: "draft" | "published" | "archived";
  mode: "on-sale" | "pre-order" | "available";
  variants: CreateVariantInput[];
}

export interface Account {
  bankName: string;
  bankId: string;
  accountName: string;
  currency: "NGN" | "USD";
  accountNumber: string;
  sortCode: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerifyOTP {
  bank;
}

export interface Banks {
  id: number;
  code: number;
  name: string;
}

export interface ResolveBank {
  data: {
    account_name: string;
    account_number: string;
  };
}

export interface CategoryFilter {
  data: {
    id: string;
    name: string;
    slug: string
  }
}
