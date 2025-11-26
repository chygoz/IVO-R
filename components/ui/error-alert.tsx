import React from "react";

type ErrorAlertProps = {
  children: React.ReactNode;
};
function ErrorAlert({ children }: ErrorAlertProps) {
  return (
    <div className="bg-red-100 text-red-600 p-4 w-full text-sm rounded-xl font-medium">
      {children}
    </div>
  );
}

export default ErrorAlert;
