import { WishlistItem, WishlistResponse } from "@/types/wishlist";
import { fetchAPI } from "./config";

/**
 * Wishlist API Service
 * Handles all wishlist-related API requests
 */
class WishlistService {
  private apiUrl: string = "/api/v1/wishlist";

  /**
   * Get all items from the user's wishlist
   */
  async getWishlistItems(): Promise<WishlistItem[]> {
    try {
      const response = await fetchAPI({
        url: this.apiUrl,
      });

      if (response.error) {
        throw new Error(`Error ${response.details}`);
      }

      const data: WishlistResponse = response;
      return data.data || [];
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      throw error;
    }
  }

  /**
   * Add a product to the wishlist
   */
  async addToWishlist(
    productId: string,
    variantId?: string
  ): Promise<WishlistItem> {
    try {
      const response = await fetchAPI({
        method: "POST",
        url: this.apiUrl,
        body: {
          productId,
          ...(variantId && { variantId }),
        },
      });

      if (response.error) {
        const errorData = response;
        throw new Error(errorData.details || "something went wrong");
      }

      const data = response;
      return data.data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  }

  /**
   * Remove an item from the wishlist
   */
  async removeFromWishlist(itemId: string): Promise<void> {
    try {
      const response = await fetchAPI({
        url: `${this.apiUrl}/${itemId}`,
        method: "DELETE",
      });

      if (response.error) {
        const errorData = response;
        throw new Error(errorData.message || "something went wrong");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  }

  /**
   * Check if a product is in the wishlist
   */
  async checkInWishlist(
    productId: string,
    variantId?: string
  ): Promise<{ inWishlist: boolean; itemId?: string }> {
    try {
      let url = `${this.apiUrl}/check/${productId}`;
      if (variantId) {
        url += `?variantId=${variantId}`;
      }

      const response = await fetchAPI({
        url,
      });

      if (response.error) {
        return { inWishlist: false };
      }

      const data = response;
      return {
        inWishlist: data.inWishlist,
        itemId: data.data?._id,
      };
    } catch (error) {
      console.error("Error checking wishlist status:", error);
      // Default to not in wishlist on errors
      return { inWishlist: false };
    }
  }

  /**
   * Clear the entire wishlist
   */
  async clearWishlist(): Promise<void> {
    try {
      const response = await fetchAPI({
        method: "DELETE",
        url: this.apiUrl,
      });

      if (response.error) {
        const errorData = response;
        throw new Error(errorData.message || "something went wrong");
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      throw error;
    }
  }
}

// Export as singleton
export const wishlistService = new WishlistService();
