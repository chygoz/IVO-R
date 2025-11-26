"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "@/hooks/use-wishlist-hook";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { wishlistService } from "@/actions/wishlist";

interface WishlistButtonProps {
  productId: string;
  variantId?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "text" | "full";
  showLabel?: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  variantId,
  className = "",
  size = "md",
  variant = "icon",
  showLabel = false,
}) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();

  // Check if the item is in the wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      setIsChecking(true);

      // First check in the local state
      const existingItem = wishlistItems.find(
        (item) =>
          item.product._id === productId &&
          ((!variantId && !item.variant) ||
            (variantId && item.variant?._id === variantId))
      );

      if (existingItem) {
        setInWishlist(true);
        setItemId(existingItem._id);
        setIsChecking(false);
        return;
      }

      try {
        const result = await wishlistService.checkInWishlist(
          productId,
          variantId
        );

        setInWishlist(result.inWishlist || false);
        setItemId(result.itemId || null);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        setInWishlist(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkWishlistStatus();
  }, [productId, variantId, wishlistItems]);

  // Toggle wishlist item
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist && itemId) {
      await removeFromWishlist(itemId);
      setInWishlist(false);
      setItemId(null);
    } else {
      await addToWishlist(productId, variantId);
      setInWishlist(true);
      // Note: itemId will be updated on the next render via the useEffect
    }
  };

  // Icon size mappings
  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <Button
      variant="outline"
      onClick={handleToggleWishlist}
      className={cn(
        "flex-1 py-5 border transition-all duration-200",
        inWishlist
          ? "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
          : "border-[#20483f]/30 text-[#20483f] hover:bg-[#20483f]/5"
      )}
    >
      <Heart
        className={cn("h-5 w-5 mr-2", inWishlist ? "fill-pink-500" : "")}
      />
      {inWishlist ? "Saved" : "Save"}
    </Button>
  );
};

export default WishlistButton;
