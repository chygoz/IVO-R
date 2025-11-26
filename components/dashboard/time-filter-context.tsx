"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { TimeRange } from "./types";

interface TimeFilterContextType {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

const TimeFilterContext = createContext<TimeFilterContextType | undefined>(
  undefined
);

export function TimeFilterContextProvider({
  children,
  initialTimeRange = "all",
}: {
  children: React.ReactNode;
  initialTimeRange: TimeRange;
}) {
  const [timeRange, setTimeRangeState] = useState<TimeRange>(initialTimeRange);
  const router = useRouter();
  const pathname = usePathname();

  // Update URL when time range changes
  const setTimeRange = (range: TimeRange) => {
    setTimeRangeState(range);

    // Update URL search params
    const params = new URLSearchParams(window.location.search);
    params.set("timeRange", range);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Value to be provided to consumers
  const value = {
    timeRange,
    setTimeRange,
  };

  return (
    <TimeFilterContext.Provider value={value}>
      {children}
    </TimeFilterContext.Provider>
  );
}

export function useTimeFilter() {
  const context = useContext(TimeFilterContext);
  if (context === undefined) {
    throw new Error(
      "useTimeFilter must be used within a TimeFilterContextProvider"
    );
  }
  return context;
}
