
import React from "react";
import { Id } from "react-toastify";

type Product = {
  slug: string; // Ensure this field exists
  basePrice: number;
  description: string;
  variants: Array<{
    gallery: Array<{ url: string }>;
  }>;
};

const ProductCard = ({ slug, description, basePrice }: Product) => {
  return (
    <div className="w-full sm:flex sm:space-x-10 justify-start items-start">
      {/* <ImageCard /> */}
      {/* <ProductDescriptionCard slug={slug} description={description} basePrice={basePrice} /> */}
    </div>
  );
};

export default ProductCard;
