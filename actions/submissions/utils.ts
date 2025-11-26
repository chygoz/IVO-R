import { Size } from "recharts/types/util/types";
import { User } from "next-auth";

export const CLIENT_URL = `/api/v1/submissions`;

export type SubmissionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "modified";
export type SubmissionType = "blank" | "product";

export type SubmissionCategory = "add" | "edit" | "delete";

export interface Variant {
  color: Color;
  size: Size;
  quantity: number;
  status?: any;
  price?: Price;
  gallery: Gallery[];
}

export interface Product {
  name: string;
  description: string;
  gender: string;
  basePrice: Price;
  mode: string;
  sizeFit: string;
  details: string[];
  category?: { name: string };
  itemCollection?: string;
  status?: string;
  variants: Variant[];
}

export type Submission = {
  _id: string;
  type: SubmissionType;
  business: {
    name: string;
    _id: string;
  };
  items: Product[];
  status: SubmissionStatus;
  initiated: {
    user: User;
    initiatedAt: Date;
  };
  category: SubmissionCategory;
  approved: {
    user: User;
    approvedAt: Date;
  };
  updatedAt: Date;
  updates: SubmissionUpdate[];
};

export interface SubmissionUpdate {
  status: SubmissionStatus;
  reason: string;
  updatedBy: User;
  updatedAt: Date;
}

export interface CreateVariantInput {
  price?: Price;
  quantity: number;
  color: Color;
  size: {
    name: string; //"M";
    code: string; //"MD";
    displayName: string; //"Medium";
    sortOrder: number; //1;
  };
  gallery: Gallery[];
}

export type Gallery = {
  type: string; //"full";
  view: string; //"front";
  mode: string; //"product";
  url: string;
};

export type Color = {
  name: string; //"black";
  hex: string; // "#000";
  code: string; //"bl";
};

export type Currency = "USD" | "NGN";

export type Price = {
  currency: Currency;
  value: string;
};

export interface CreateProductInput {
  name: string;
  description: string;
  sizeFit: string;
  gender: "men" | "women" | "unisex";
  basePrice: Price;
  category: string;
  status: "draft" | "published" | "archived";
  mode: "on-sale" | "pre-order" | "available";
  variants: CreateVariantInput[];
}
