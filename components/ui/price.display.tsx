import React from "react";

interface PriceProps {
  value?: string;
  currency?: "USD" | "NGN";
}

const formatPrice = (value: string, currency: "USD" | "NGN") => {
  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return "Invalid price";
  }

  switch (currency) {
    case "USD":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(numValue);
    case "NGN":
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(numValue);
    default:
      return "Invalid currency";
  }
};

const PriceDisplay: React.FC<PriceProps> = ({ value, currency }) => {
  if (!value || !currency) {
    return <span className="text-gray-400 italic">Price unavailable</span>;
  }

  return <span className="font-medium">{formatPrice(value, currency)}</span>;
};

export default PriceDisplay;
