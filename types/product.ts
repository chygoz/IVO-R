export interface IGallery {
  url: string;
}

export interface IDimension {
  length: number;
  width: number;
  height: number;
}

export interface IShipping {
  weight: number;
  weightUnit: string;
  dimension: IDimension;
}

export interface IPrice {
  currency: "USD" | "NGN";
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  code: string;
  description: string;
  sizeFit: string;
  mode: "on-sale" | "pre-order" | "available";
  business: { _id: string; name: string; slug: string };
  meta: {
    title: string;
    description: string;
  };
  source: "product" | "blank";
  published: boolean;
  gender: "men" | "women" | "unisex";
  group: "adult" | "kids";
  status: "draft" | "published" | "ready" | "pending";
  totalQuantity: number;
  details: string[];
  variants: IVariant[];
  category: { _id: string; name: string };
  basePrice: IPrice;
  discount: IPrice;
  tags: string[];
  user: string;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  shipping?: {
    weight: string;
    dimensions: {
      length: string;
      width: string;
      height: string;
    };
  };
  lookBuilders: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserShipping {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
}

/**
 * Product Types
 */

// Gallery item
export interface GalleryItem {
  name: string;
  url: string;
  mode: "model" | "product";
  type: "full" | "half" | "close-up";
  view: "front" | "back" | "side" | "top" | "bottom";
}

// Price
export interface Price {
  currency: "USD" | "NGN";
  value: string;
}

// Category
export interface Category {
  _id: string;
  name: string;
}

// Filter Options
export interface FilterOption {
  code: string;
  name: string;
  hex?: string;
  displayName?: string;
}

// Price Range
export interface PriceRange {
  _id: string;
  min: number;
  max: number;
}

// Filters
export interface Filters {
  colors: FilterOption[];
  sizes: FilterOption[];
  priceRange: PriceRange[];
  categories: Category[];
}

// Pagination
export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

// Search Response
export interface SearchResponse {
  success: boolean;
  data: Product[];
  pagination: Pagination;
}

// Search Params
export interface SearchParams {
  query?: string;
  category?: string;
  gender?: string;
  group?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  status?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
  mode?: string;
}

export interface QueryDTO {
  p: number;
  l: number;
  q?: string;
  sortDir: "asc" | "desc";
}

import { IVariant, ProductSize } from "@/store/product-store";
import z from "zod";

export interface ProductQueryDTO extends QueryDTO {
  status?: string;
  business: string;
  gender?: string;
  category?: string;
  categorySlug?: string;
  date?: string[];
  sortBy: "name" | "createdAt";
}

// Example query schema using Zod
export const productQuerySchema = z.object({
  // Optional string, trimmed and with max length
  q: z.string().trim().max(100).optional(),
  // Optional number with min/max constraints
  p: z.coerce.number().int().min(1).default(1),
  // Optional number with min/max constraints
  l: z.coerce.number().int().min(1).max(100).default(10),
  // Optional enum for sorting
  sortBy: z.enum(["name", "createdAt"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
  business: z.string(),
  gender: z.string().optional(),
  category: z.string().optional(),
  categorySlug: z.string().optional(),
  date: z.array(z.string()).optional(),
  status: z.string().optional(),
});

export interface ApiProductsResponse {
  status: string;
  data: {
    results: Product[];
    metadata: {
      totalCount: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
