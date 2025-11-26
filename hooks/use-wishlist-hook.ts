"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
//@ts-expect-error
import useAuth from "@/hooks/use-auth";
import { wishlistService } from "@/actions/wishlist";
import { WishlistItem } from "@/types/wishlist";
import { useAuthModal } from "./use-auth-modal";

interface UseWishlistReturn {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  isAddingToWishlist: boolean;
  isRemovingFromWishlist: boolean;
  addToWishlist: (productId: string, variantId?: string) => Promise<void>;
  removeFromWishlist: (itemId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  checkInWishlist: (productId: string, variantId?: string) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

export const useWishlist = (): UseWishlistReturn => {
  const { auth } = useAuth();
  const { openModal } = useAuthModal();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<boolean>(false);
  const [isRemovingFromWishlist, setIsRemovingFromWishlist] =
    useState<boolean>(false);

  // Fetch wishlist items
  const fetchWishlistItems = useCallback(async () => {
    if (!auth.isAuthenticated) {
      setWishlistItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const items = await wishlistService.getWishlistItems();
      setWishlistItems(items);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      // toast.error("Failed to load wishlist items");
    } finally {
      setIsLoading(false);
    }
  }, [auth.isAuthenticated]);

  // Add to wishlist
  const addToWishlist = useCallback(
    async (productId: string, variantId?: string) => {
      if (!auth.isAuthenticated) {
        openModal();
        return;
      }

      try {
        setIsAddingToWishlist(true);
        const item = await wishlistService.addToWishlist(productId, variantId);

        // Update local state
        setWishlistItems((prev) => {
          // Check if item already exists
          const exists = prev.some(
            (i) =>
              i.product._id === productId &&
              ((!variantId && !i.variant) ||
                (variantId && i.variant?._id === variantId))
          );

          if (exists) return prev;

          return [item, ...prev];
        });

        toast.success("Item added to wishlist");
      } catch (error: any) {
        // Handle duplicate error gracefully
        if (error.message.includes("already exists")) {
          toast.info("Item is already in your wishlist");
        } else {
          console.error("Error adding to wishlist:", error);
          toast.error("Failed to add item to wishlist");
        }
      } finally {
        setIsAddingToWishlist(false);
      }
    },
    [auth.isAuthenticated, openModal]
  );

  // Remove from wishlist
  const removeFromWishlist = useCallback(
    async (itemId: string) => {
      if (!auth.isAuthenticated) return;

      try {
        setIsRemovingFromWishlist(true);
        await wishlistService.removeFromWishlist(itemId);

        // Update local state
        setWishlistItems((prev) => prev.filter((item) => item._id !== itemId));

        toast.success("Item removed from wishlist");
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove item from wishlist");
      } finally {
        setIsRemovingFromWishlist(false);
      }
    },
    [auth.isAuthenticated]
  );

  // Clear wishlist
  const clearWishlist = useCallback(async () => {
    if (!auth.isAuthenticated) return;

    try {
      await wishlistService.clearWishlist();

      // Update local state
      setWishlistItems([]);

      toast.success("Wishlist cleared successfully");
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
    }
  }, [auth.isAuthenticated]);

  // Check if item is in wishlist
  const checkInWishlist = useCallback(
    async (productId: string, variantId?: string): Promise<boolean> => {
      if (!auth.isAuthenticated) return false;

      try {
        const { inWishlist } = await wishlistService.checkInWishlist(
          productId,
          variantId
        );
        return inWishlist;
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        return false;
      }
    },
    [auth.isAuthenticated]
  );

  // Refresh wishlist data
  const refreshWishlist = useCallback(async () => {
    await fetchWishlistItems();
  }, [fetchWishlistItems]);

  // Initial fetch
  useEffect(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  return {
    wishlistItems,
    isLoading,
    isAddingToWishlist,
    isRemovingFromWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    checkInWishlist,
    refreshWishlist,
  };
};
