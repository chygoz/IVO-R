"use client";

import { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

export function ColorPicker({
  color,
  onChange,
  presetColors = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
  ],
}: ColorPickerProps) {
  const [localColor, setLocalColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local color when prop changes
  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Add # if missing
    const newColor = value.startsWith("#") ? value : `#${value}`;
    setLocalColor(newColor);
  };

  const handleAccept = () => {
    // Validate hex color
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(localColor);
    if (isValidHex) {
      // Normalize to 6 digits
      const normalizedColor =
        localColor.length === 4
          ? `#${localColor[1]}${localColor[1]}${localColor[2]}${localColor[2]}${localColor[3]}${localColor[3]}`
          : localColor;
      onChange(normalizedColor);
      setIsOpen(false);
    } else {
      // Reset to previous valid color
      setLocalColor(color);
    }
  };

  const handleCancel = () => {
    setLocalColor(color);
    setIsOpen(false);
  };

  const handlePresetClick = (presetColor: string) => {
    setLocalColor(presetColor);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="h-10 w-10 rounded-md border flex items-center justify-center"
          style={{ backgroundColor: color }}
          aria-label="Pick a color"
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <HexColorPicker
            color={localColor}
            onChange={handleColorChange}
            className="w-full !h-48"
          />

          <div className="flex gap-2">
            <div
              className="h-9 w-9 rounded-md border"
              style={{ backgroundColor: localColor }}
            />
            <Input
              ref={inputRef}
              value={localColor}
              onChange={handleInputChange}
              className="flex-1"
              maxLength={7}
            />
          </div>

          {presetColors && presetColors.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">
                Preset Colors
              </p>
              <div className="flex flex-wrap gap-2">
                {presetColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    className="h-6 w-6 rounded-md border hover:scale-110 transition-transform"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handlePresetClick(presetColor)}
                    aria-label={`Select color ${presetColor}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="w-full"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleAccept} className="w-full">
              <Check className="h-4 w-4 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
