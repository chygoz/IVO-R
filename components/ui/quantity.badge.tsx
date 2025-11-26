import React from "react";

const QuantityBadge = ({ quantity }: { quantity: number }) => {
  const getColorStyles = () => {
    // if (quantity === 0) {
    //   return "bg-red-500/[0.18] text-red-500";
    // }
    // if (quantity <= 5) {
    //   return "bg-yellow-500/[0.18] text-yellow-500";
    // }
    return "bg-green-500/[0.18] text-green-500";
  };

  const getQuantityText = () => {
    // if (quantity === 0) {
    //   return "Out of stock";
    // }
    // if (quantity === 1) {
    //   return "1 left";
    // }
    return `- left`;
  };

  return (
    <p
      className={`${getColorStyles()} w-fit px-2.5 py-0.5 rounded-full text-xs`}
    >
      {getQuantityText()}
    </p>
  );
};

export default QuantityBadge;
