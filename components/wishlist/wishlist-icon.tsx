"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
// import { useWishlistContext } from "@/contexts/wishlist-context";
import { cn } from "@/lib/utils";

interface WishlistIconProps {
  className?: string;
}

const WishlistIcon: React.FC<WishlistIconProps> = ({ className }) => {
  // const { wishlistCount } = useWishlistContext();

  return (
    <Link href="/wishlist" passHref>
      <motion.div
        className={cn(
          "relative flex items-center justify-center cursor-pointer",
          className
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart
          size={24}
          className="text-gray-700 hover:text-[#20483f] transition-colors"
        />
        {/* 
        {wishlistCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-2 w-5 h-5 bg-[#20483f] text-white text-xs rounded-full flex items-center justify-center"
          >
            {wishlistCount > 9 ? "9+" : wishlistCount}
          </motion.div>
        )} */}
      </motion.div>
    </Link>
  );
};

export default WishlistIcon;
