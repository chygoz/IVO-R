"use client";
import React, { useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type QueryProviderProps = {
  children: React.ReactNode;
};

function QueryProvider({ children }: QueryProviderProps) {
  const queryClientRef = useRef<any>(undefined);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60 * 5,
        },
      },
    });
  }
  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}{" "}
    </QueryClientProvider>
  );
}

export default QueryProvider;
