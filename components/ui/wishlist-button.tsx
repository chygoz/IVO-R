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
  const {
    addToWishlist,
    removeFromWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
    wishlistItems,
  } = useWishlist();

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

  // Size mappings
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  // Icon size mappings
  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  // Variant styles
  const getButtonStyle = () => {
    switch (variant) {
      case "text":
        return "bg-transparent border-none hover:bg-gray-100 text-gray-700 flex items-center gap-2";
      case "full":
        return `bg-white border border-gray-300 hover:border-gray-400 text-gray-700 flex items-center justify-center gap-2 ${
          showLabel ? "px-4" : ""
        }`;
      case "icon":
      default:
        return "bg-white hover:bg-gray-50 border border-gray-300 rounded-full shadow-sm flex items-center justify-center";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          getButtonStyle(),
          sizeClasses[size],
          inWishlist && "text-red-500 hover:text-red-600 border-red-200",
          (isAddingToWishlist || isRemovingFromWishlist || isChecking) &&
            "opacity-70 cursor-wait"
        )}
        onClick={handleToggleWishlist}
        disabled={isAddingToWishlist || isRemovingFromWishlist || isChecking}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={iconSize[size]}
          className={cn(
            "transition-all duration-300",
            inWishlist ? "fill-red-500 text-red-500" : "fill-transparent"
          )}
        />
        {showLabel && (
          <span className={inWishlist ? "text-red-500" : ""}>
            {inWishlist ? "In Wishlist" : "Add to Wishlist"}
          </span>
        )}
      </Button>
    </motion.div>
  );
};

export default WishlistButton;
