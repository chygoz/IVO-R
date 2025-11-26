import { Product } from "./product";

/**
 * Wishlist Item Interface
 */
export interface WishlistItem {
  _id: string;
  user: string;
  product: Product;
  variant?: any;
  addedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Wishlist Response Interface
 */
export interface WishlistResponse {
  success: boolean;
  message?: string;
  data: WishlistItem[];
}

/**
 * Wishlist Item Response Interface
 */
export interface WishlistItemResponse {
  success: boolean;
  message?: string;
  data: WishlistItem;
}

/**
 * Wishlist Check Response Interface
 */
export interface WishlistCheckResponse {
  success: boolean;
  inWishlist: boolean;
  data?: WishlistItem;
}
