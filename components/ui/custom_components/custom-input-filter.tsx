"use client"

import React from 'react';
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";


type CustomInputFilterProps = {
  setFilterValue?: (value: string) => void;
  defaultValue?: string
  placeholder?: string;
  className?: string;
};

const CustomInputFilter: React.FC<CustomInputFilterProps> = ({
  setFilterValue,
  placeholder = "Filter...",
  defaultValue,
  className,
}) => {


  return (
    <div className={`relative max-w-sm ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-5 w-5 text-gray-500" />
      </div>
      <Input
        placeholder={placeholder}
        onChange={(e) => setFilterValue?.(e.target.value)}
        defaultValue={defaultValue}
        className="pl-10" // extra left padding for the icon space
      />
    </div>
  );
};

export default CustomInputFilter;
