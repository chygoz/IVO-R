import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Check } from "lucide-react";

interface PriceInputProps {
  id: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  currency?: string;
  className?: string;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "Enter price",
  label,
  error,
  disabled = false,
  required = false,
  min = 0,
  max,
  currency = "NGN",
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Format number with commas and ensure .00 decimal places
  const formatPrice = (num: string): string => {
    // Remove all non-digit characters except decimal point
    const cleanNum = num.replace(/[^\d.]/g, "");

    // Handle multiple decimal points
    const parts = cleanNum.split(".");
    if (parts.length > 2) {
      const formatted = parts[0] + "." + parts.slice(1).join("");
      return formatPrice(formatted);
    }

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
    }

    const number = parseFloat(parts.join("."));
    if (isNaN(number)) return "";

    // Add commas to integer part
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const decimalPart = parts[1] || "";

    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  };

  // Format for display (always show .00 when not focused)
  const formatForDisplay = (val: string): string => {
    if (!val || val === "0") return "";

    const cleaned = val.replace(/[^\d.]/g, "");
    const number = parseFloat(cleaned);

    if (isNaN(number)) return "";

    if (!isFocused) {
      // Show formatted with .00 when not focused
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(number);
    } else {
      // Show working format when focused
      return formatPrice(val);
    }
  };

  // Get raw numeric value
  const getRawValue = (formattedValue: string): string => {
    return formattedValue.replace(/[^\d.]/g, "");
  };

  // Validate price
  const validatePrice = (val: string): boolean => {
    const numVal = parseFloat(getRawValue(val));
    if (isNaN(numVal)) return !required;
    if (min !== undefined && numVal < min) return false;
    if (max !== undefined && numVal > max) return false;
    return true;
  };

  // Initialize display value
  useEffect(() => {
    const initialValue = value?.toString() || "";
    if (initialValue) {
      const formatted = formatForDisplay(initialValue);
      setDisplayValue(formatted);
      setIsValid(validatePrice(formatted));
    }
    //eslint-disable-next-line
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (!inputValue) {
      setDisplayValue("");
      onChange("");
      setIsValid(!required);
      return;
    }

    // Format the input
    const formatted = formatPrice(inputValue);
    setDisplayValue(formatted);

    // Validate
    const valid = validatePrice(formatted);
    setIsValid(valid);

    // Send raw value to parent
    const rawValue = getRawValue(formatted);
    onChange(rawValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Convert display format to editable format
    if (displayValue) {
      const editableValue = formatPrice(displayValue);
      setDisplayValue(editableValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Convert to display format
    if (displayValue) {
      const formatted = formatForDisplay(displayValue);
      setDisplayValue(formatted);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if (
      [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey) ||
      (e.keyCode === 67 && e.ctrlKey) ||
      (e.keyCode === 86 && e.ctrlKey) ||
      (e.keyCode === 88 && e.ctrlKey) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  const getCurrencySymbol = (currency: string): string => {
    const symbols: Record<string, string> = {
      USD: "$",
      NGN: "₦",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      CAD: "C$",
      AUD: "A$",
    };
    return symbols[currency] || "₦";
  };

  const hasError = error || !isValid;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <motion.label
          htmlFor={id}
          className={`block text-sm font-medium mb-2 transition-colors duration-200 ${hasError
            ? "text-red-600"
            : isFocused
              ? "text-blue-600"
              : "text-gray-700"
            }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      <div className="relative">
        <motion.div
          className={`relative flex items-center transition-all duration-200 ${disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.1 }}
        >
          {/* Currency Symbol */}
          <div
            className={`absolute left-0 top-0 bottom-0 flex items-center justify-center w-10 border-r transition-colors duration-200 ${hasError
              ? "border-red-300 bg-red-50 text-red-600"
              : isFocused
                ? "border-blue-300 bg-blue-50 text-blue-600"
                : "border-gray-300 bg-gray-50 text-gray-500"
              } ${isFocused || displayValue ? "rounded-l-lg" : "rounded-l-lg"}`}
          >
            <span className="text-sm font-medium">
              {getCurrencySymbol(currency)}
            </span>
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`w-full pl-12 pr-12 py-3 text-lg font-mono border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${hasError
              ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white hover:border-gray-400"
              } ${disabled ? "cursor-not-allowed" : ""}`}
          />

          {/* Status Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AnimatePresence mode="wait">
              {hasError ? (
                <motion.div
                  key="error"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </motion.div>
              ) : displayValue && isValid ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-5 h-5 text-green-500" />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2"
            >
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error || (!isValid && "Please enter a valid price")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        {(min !== undefined || max !== undefined) && (
          <motion.p
            className="mt-2 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {min !== undefined && max !== undefined
              ? `Price must be between ${getCurrencySymbol(currency)}${min.toLocaleString()} and ${getCurrencySymbol(currency)}${max.toLocaleString()}`
              : min !== undefined
                ? `Minimum price: ${getCurrencySymbol(currency)}${min.toLocaleString()}`
                : `Maximum price: ${getCurrencySymbol(currency)}${max?.toLocaleString()}`}
          </motion.p>
        )}
      </div>
    </div>
  );
};
