import React from "react";

type EmptyTableProps = {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
};

function EmptyTable({ title, subTitle, children }: EmptyTableProps) {
  return (
    <div className="flex flex-col justify-center items-center max-w-sm mx-auto">
      <div className="p-2 bg-primary-20 rounded-full size-10 flex flex-col justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
          />
        </svg>
      </div>
      <h5 className="font-semibold mt-2">{title}</h5>
      {subTitle && <p className="text-center">{subTitle}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}

export default EmptyTable;
