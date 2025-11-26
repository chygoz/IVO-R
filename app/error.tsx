"use client";
import BackButton from "@/components/ui/back-button";
import React from "react";

function ErrorBoundary() {
  return (
    <div className="h-screen w-full flex flex-col gap-2 justify-center items-center">
      <p>Something is went wrong</p>
      <BackButton />
    </div>
  );
}

export default ErrorBoundary;
