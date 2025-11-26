"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface InputQuantityProps {
  id?: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  showButtons?: boolean;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  error?: string;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const InputQuantity: React.FC<InputQuantityProps> = ({
  id,
  label,
  value,
  onChange,
  min = 1,
  max,
  step = 1,
  disabled = false,
  className,
  showButtons = true,
  size = "md",
  placeholder,
  error,
  onBlur,
  onFocus,
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // Validate and clamp value
  const validateAndClampValue = (val: number): number => {
    if (isNaN(val) || val < min) return min;
    if (max !== undefined && val > max) return max;
    return Math.floor(val); // Ensure integer
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Allow empty string for better UX while typing
    if (rawValue === "") {
      setInputValue("");
      setIsInvalid(false);
      return;
    }

    // Only allow numbers
    const numericValue = rawValue.replace(/[^\d]/g, "");

    if (numericValue !== rawValue) {
      // Invalid characters were removed, show feedback
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 200);
      return;
    }

    const parsedValue = parseInt(numericValue, 10);

    // Check constraints
    if (max !== undefined && parsedValue > max) {
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 200);
      return;
    }

    setInputValue(numericValue);

    // Only call onChange if value is valid
    if (!isNaN(parsedValue) && parsedValue >= min) {
      onChange(parsedValue);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    setIsFocused(false);

    // If input is empty or invalid, reset to current value
    if (inputValue === "" || isNaN(parseInt(inputValue, 10))) {
      setInputValue(value.toString());
    } else {
      // Validate and update final value
      const parsedValue = parseInt(inputValue, 10);
      const clampedValue = validateAndClampValue(parsedValue);

      if (clampedValue !== parsedValue) {
        setInputValue(clampedValue.toString());
      }

      if (clampedValue !== value) {
        onChange(clampedValue);
      }
    }

    onBlur?.();
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  // Handle increment
  const handleIncrement = () => {
    if (disabled) return;

    const newValue = validateAndClampValue(value + step);
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  // Handle decrement
  const handleDecrement = () => {
    if (disabled) return;

    const newValue = validateAndClampValue(value - step);
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  // Handle key down for arrow keys
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleDecrement();
    } else if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      input: "h-8 text-sm px-2",
      button: "h-6 w-6 p-0",
      iconSize: "h-3 w-3",
    },
    md: {
      input: "h-10 text-sm px-3",
      button: "h-8 w-8 p-0",
      iconSize: "h-4 w-4",
    },
    lg: {
      input: "h-12 text-base px-4",
      button: "h-10 w-10 p-0",
      iconSize: "h-5 w-5",
    },
  };

  const config = sizeConfig[size];

  // Check if buttons should be disabled
  const isDecrementDisabled = disabled || value <= min;
  const isIncrementDisabled = disabled || (max !== undefined && value >= max);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {max !== undefined && (
            <span className="text-muted-foreground ml-1">(max: {max})</span>
          )}
        </Label>
      )}

      <div className="relative">
        <div
          className={cn(
            "flex items-center border rounded-md transition-colors",
            isFocused ? "ring-2 ring-primary ring-offset-2" : "",
            error ? "border-red-500" : "border-input",
            disabled ? "opacity-50 cursor-not-allowed" : "",
            isInvalid ? "border-red-500" : ""
          )}
        >
          {showButtons && (
            <Button
              type="button"
              variant="ghost"
              className={cn(
                config.button,
                "rounded-none rounded-l-md border-0 hover:bg-muted",
                isDecrementDisabled ? "cursor-not-allowed opacity-50" : ""
              )}
              onClick={handleDecrement}
              disabled={isDecrementDisabled}
              tabIndex={-1}
            >
              <Minus className={config.iconSize} />
            </Button>
          )}

          <motion.div
            animate={isInvalid ? { x: [-2, 2, -2, 2, 0] } : {}}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <Input
              ref={inputRef}
              id={id}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={placeholder}
              className={cn(
                config.input,
                "border-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0",
                showButtons ? "rounded-none" : "rounded-md"
              )}
              aria-describedby={error ? `${id}-error` : undefined}
              aria-invalid={!!error}
              min={min}
              max={max}
            />
          </motion.div>

          {showButtons && (
            <Button
              type="button"
              variant="ghost"
              className={cn(
                config.button,
                "rounded-none rounded-r-md border-0 hover:bg-muted",
                isIncrementDisabled ? "cursor-not-allowed opacity-50" : ""
              )}
              onClick={handleIncrement}
              disabled={isIncrementDisabled}
              tabIndex={-1}
            >
              <Plus className={config.iconSize} />
            </Button>
          )}
        </div>

        {/* Visual feedback for constraints */}
        {isFocused && max !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-6 left-0 right-0 flex justify-center"
          >
            <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded shadow-sm">
              {min} - {max}
            </div>
          </motion.div>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          id={`${id}-error`}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}

      {/* Progress indicator for max value */}
      {max !== undefined && max > min && !error && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{min}</span>
            <span>{value}</span>
            <span>{max}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <motion.div
              className="bg-primary h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((value - min) / (max - min)) * 100}%`,
              }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
