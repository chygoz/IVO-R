"use client";
import React, { useState, useEffect } from "react";
import { Input } from "./input";

type MoneyInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const MoneyInput: React.FC<MoneyInputProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState<string>(defaultValue || "");
  const [isEditing, setIsEditing] = useState(false);

  // Helper function to format the input value to currency format
  const formatCurrency = (input: string) => {
    const numericValue = input.replace(/\D/g, ""); // Remove any non-numeric characters
    if (numericValue === "") return ""; // If empty, return an empty string
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0, // No decimals initially
      maximumFractionDigits: 2,
    }).format(Number(numericValue));
  };

  // Sync display value with controlled value updates when not editing
  useEffect(() => {
    if (controlledValue !== undefined && !isEditing) {
      setDisplayValue(formatCurrency(controlledValue));
    }
  }, [controlledValue, isEditing]);

  // Handle focus: Enter editing mode with raw value (unformatted)
  const handleFocus = () => {
    setIsEditing(true);
    setDisplayValue((prev) => prev.replace(/\D/g, "")); // Show only raw numbers
  };

  // Handle blur: Exit editing mode and format the value as currency
  const handleBlur = () => {
    setIsEditing(false);
    setDisplayValue(formatCurrency(displayValue)); // Format for display on blur
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numeric input and prevent adding leading "0" unless decimal is used
    const rawValue = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setDisplayValue(rawValue); // Set raw numeric value for editing mode

    // Emit the raw numeric value to the external onChange handler
    if (onChange) {
      const customEvent = {
        ...event,
        target: {
          ...event.target,
          value: rawValue, // Pass the numeric string as value
        },
      };
      onChange(customEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <Input
      {...props}
      value={isEditing ? displayValue : formatCurrency(displayValue)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};

export default MoneyInput;