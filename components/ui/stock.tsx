import React from "react";

const StockBadge = ({ status }: { status: string }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-600";
      case "out-of-stock":
        return "bg-red-100 text-red-600";
      case "limited-stock":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in-stock":
        return "In Stock";
      case "out-of-stock":
        return "Out of Stock";
      case "limited-stock":
        return "Limited Stock";
      default:
        return "Unknown Status";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
        status
      )}`}
    >
      {getStatusText(status)}
    </span>
  );
};

export default StockBadge;
