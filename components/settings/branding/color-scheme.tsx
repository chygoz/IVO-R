"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { ColorPicker } from "@/components/ui/color-wheel";
import { Control } from "react-hook-form";

// Predefined color combinations for quick selection
const colorCombinations = [
  { primary: "#8A6D3B", secondary: "#F0EAD6", name: "Gold" },
  { primary: "#E63946", secondary: "#F1FAEE", name: "Red" },
  { primary: "#1D3557", secondary: "#F1FAEE", name: "Navy" },
  { primary: "#2A9D8F", secondary: "#E9F5DB", name: "Teal" },
  { primary: "#8338EC", secondary: "#FFCCD5", name: "Purple" },
  { primary: "#2C3E50", secondary: "#ECF0F1", name: "Dark Blue" },
  { primary: "#6C63FF", secondary: "#F5F5F5", name: "Indigo" },
  { primary: "#FF6B6B", secondary: "#F7FFF7", name: "Coral" },
];

interface ColorSchemeProps {
  control: Control<any>;
  watch: any;
  applyColorCombination: (primary: string, secondary: string) => void;
}

export const ColorScheme = ({
  control,
  watch,
  applyColorCombination,
}: ColorSchemeProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Color Scheme</h3>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Color</FormLabel>
                <FormControl>
                  <ColorPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="#000000"
                  />
                </FormControl>
                <FormDescription>
                  Used for buttons, headings, and accents.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="secondaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Color</FormLabel>
                <FormControl>
                  <ColorPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="#FFFFFF"
                  />
                </FormControl>
                <FormDescription>
                  Used for backgrounds and subtle elements.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={control}
            name="accentColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accent Color</FormLabel>
                <FormControl>
                  <ColorPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="#CCCCCC"
                  />
                </FormControl>
                <FormDescription>
                  Used for highlights and effects.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="backgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                  <ColorPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="#FFFFFF"
                  />
                </FormControl>
                <FormDescription>Main background color.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="textColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text Color</FormLabel>
                <FormControl>
                  <ColorPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="#333333"
                  />
                </FormControl>
                <FormDescription>Main text color.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          <h4 className="text-sm font-medium mb-3">Color Combinations</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Click on any combination to apply it to your store.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {colorCombinations.map((combo, index) => (
              <button
                key={index}
                type="button"
                className="flex flex-col h-full cursor-pointer overflow-hidden rounded-md border hover:border-primary/50 focus:border-primary focus:outline-none"
                onClick={() =>
                  applyColorCombination(combo.primary, combo.secondary)
                }
              >
                <div className="flex h-12 w-full">
                  <div
                    className="h-full w-1/2"
                    style={{ backgroundColor: combo.primary }}
                  />
                  <div
                    className="h-full w-1/2"
                    style={{ backgroundColor: combo.secondary }}
                  />
                </div>
                <div className="p-2 text-xs font-medium text-center">
                  {combo.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <h4 className="text-sm font-medium mb-2">Preview</h4>
          <div
            className="p-6 rounded-md border"
            style={{ backgroundColor: watch("backgroundColor") }}
          >
            <div className="flex flex-col sm:flex-row mb-4">
              <div
                className="h-8 rounded-md border-b mb-4"
                style={{ borderColor: watch("secondaryColor") }}
              >
                <div
                  className="text-lg font-medium"
                  style={{ color: watch("primaryColor") }}
                >
                  {watch("name")}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2  mb-4">
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: watch("primaryColor"),
                    color: "#FFFFFF",
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium border"
                  style={{
                    borderColor: watch("secondaryColor"),
                    color: watch("primaryColor"),
                    backgroundColor: watch("secondaryColor") + "20",
                  }}
                >
                  Secondary Button
                </button>
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: watch("accentColor"),
                    color: "#FFFFFF",
                  }}
                >
                  Accent Button
                </button>
              </div>
              <div
                className="rounded-md border p-4"
                style={{
                  borderColor: watch("secondaryColor"),
                  backgroundColor: watch("backgroundColor"),
                }}
              >
                <h3
                  className="text-lg font-medium mb-2"
                  style={{ color: watch("primaryColor") }}
                >
                  Section Heading
                </h3>
                <p className="text-base" style={{ color: watch("textColor") }}>
                  This is how your content will look with these colors.
                </p>
                <p
                  className="text-sm mt-2"
                  style={{ color: watch("textColor") + "99" }}
                >
                  Additional content with slightly reduced opacity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
