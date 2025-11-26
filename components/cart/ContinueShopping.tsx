import React from "react";
import Link from "next/link";

function ContinueShopping() {
  return (
    <div className="flex text-sm font-light items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span>Continue shopping</span>
      <Link className="font-bold underline" href="/store">
        Store
      </Link>
    </div>
  );
}

export default ContinueShopping;

