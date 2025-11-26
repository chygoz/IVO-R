"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";


interface Props {
  className?: string;
}

const HeroWithCategory: React.FC<Props> = () => {
  return (
    <motion.div className={cn("relative w-full h-screen")}
    
    initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
    >
      {/* Background Image */}
      <Image
        src="/assets/images/category/hero1.png"
        fill
        alt="The Fashion"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black/50 px-4 sm:px-8">
        <h3 className="text-lg sm:text-xl tracking-wide font-medium">
          NEW IN
        </h3>
        <h4 className="text-2xl sm:text-4xl md:text-5xl text-center max-w-2xl leading-snug font-extrabold uppercase mt-4">
          Be the First to Wear: Hot New Arrivals
        </h4>

        <Link
          href="/store"
          className="mt-8 sm:mt-12 px-6 py-3 sm:px-8 sm:py-4 text-lg sm:text-xl bg-white text-black font-medium uppercase rounded shadow hover:bg-green-900 hover:text-white transition-all duration-300 ease-in-out"
        >
          Shop Now
        </Link>
      </div>
    </motion.div>
  );
};

export default HeroWithCategory;
