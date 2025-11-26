"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomInputFilter from "./custom-input-filter";
import { CustomDatePicker } from "./custom-date-picker";

// Define the type for tab items
type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode;
};

// Props for the reusable CustomTabs component
type CustomTabsProps = {
  tabItems: TabItem[];
  defaultValue: string;
  className?: string;
};

const CustomTabs: React.FC<CustomTabsProps> = ({
  tabItems,
  defaultValue,
  className,
}) => {
  return (
    <Tabs defaultValue={defaultValue} className={`w-full space-y-6 ${className}`}>
      {/* Filter and Tabs List */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        {/* Input Filter */}
        <CustomInputFilter
          placeholder="Find Customer..."
          setFilterValue={(value: string) => {
            console.log("Filtering:", value);
          }}
        />

        {/* Tabs List and Date Picker */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full sm:w-auto">
          <TabsList className="flex overflow-x-auto sm:overflow-visible whitespace-nowrap">
            {tabItems.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="px-4 py-2">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <CustomDatePicker />
        </div>
      </div>

      {/* Tabs Content */}
      {tabItems.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="w-full">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CustomTabs;
