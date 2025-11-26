import React from "react";
import LoadingSpinner from "./loading-spinner";

type ButtonTextProps = {
  children: React.ReactNode;
  loading?: boolean;
};

function ButtonText({ children, loading }: ButtonTextProps) {
  return (
    <span className="flex items-center gap-2">
      {loading ? <LoadingSpinner /> : null}
      {children}
    </span>
  );
}

export default ButtonText;
