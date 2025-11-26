"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  placeholder?: string;
}

export const ColorPicker = ({
  value,
  onChange,
  placeholder = "#000000",
}: ColorPickerProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close the picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Validate hex color
  const isValidHex = (hex: string) => /^#([A-Fa-f0-9]{6})$/.test(hex);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    // Always ensure the # is present
    const formattedColor = newColor.startsWith("#") ? newColor : `#${newColor}`;
    onChange(formattedColor);
  };

  // Simple color picker with some predefined colors
  const quickColors = [
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#4B0082",
    "#9400D3",
    "#000000",
    "#808080",
    "#FFFFFF",
    "#8A6D3B",
    "#F0EAD6",
  ];

  return (
    <div className="flex gap-3 relative" ref={pickerRef}>
      <div
        className="h-10 w-10 rounded-md border cursor-pointer"
        style={{ backgroundColor: isValidHex(value) ? value : "#CCCCCC" }}
        onClick={() => setIsPickerOpen(!isPickerOpen)}
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className="flex-1"
      />

      {isPickerOpen && (
        <div className="absolute top-12 left-0 z-10 p-3 bg-white rounded-md shadow-lg border">
          <div className="grid grid-cols-4 gap-2 mb-2">
            {quickColors.map((color, index) => (
              <div
                key={index}
                className="h-6 w-6 rounded-md border cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color);
                  setIsPickerOpen(false);
                }}
              />
            ))}
          </div>
          <input
            type="color"
            value={isValidHex(value) ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8"
          />
        </div>
      )}
    </div>
  );
};
