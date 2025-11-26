"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Check, Eye, Palette, RefreshCw, X, ChevronRight } from "lucide-react";

// Define the StoreTheme type
export type StoreTheme = {
  template: "minimal" | "luxury" | "modern" | "classic" | "bold";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  logo?: string;
  name: string;
  id: string;
};

// Theme templates with their default colors
const themeTemplates = [
  {
    id: "luxury",
    name: "Luxury",
    description: "Elegant and sophisticated with gold accents",
    colors: {
      primary: "#8A6D3B",
      secondary: "#F0EAD6",
      accent: "#DFD7BF",
      background: "#FFFFFF",
      text: "#333333",
    },
    preview: "/api/placeholder/800/500", // Replace with actual preview images
  },
  {
    id: "bold",
    name: "Bold",
    description: "Strong and vibrant with high contrast",
    colors: {
      primary: "#E63946",
      secondary: "#1D3557",
      accent: "#457B9D",
      background: "#F1FAEE",
      text: "#1D3557",
    },
    preview: "/api/placeholder/800/500",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Timeless and traditional design",
    colors: {
      primary: "#2C3E50",
      secondary: "#ECF0F1",
      accent: "#3498DB",
      background: "#FFFFFF",
      text: "#2C3E50",
    },
    preview: "/api/placeholder/800/500",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean and minimal with bold accents",
    colors: {
      primary: "#6C63FF",
      secondary: "#F5F5F5",
      accent: "#FF6584",
      background: "#FFFFFF",
      text: "#333333",
    },
    preview: "/api/placeholder/800/500",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Understated with focus on content",
    colors: {
      primary: "#333333",
      secondary: "#FFFFFF",
      accent: "#CCCCCC",
      background: "#F8F8F8",
      text: "#333333",
    },
    preview: "/api/placeholder/800/500",
  },
];

interface ThemeSelectorProps {
  currentTheme?: Partial<StoreTheme>;
  storeName: string;
  storeId: string;
  logo?: string;
  onThemeChange?: (theme: StoreTheme) => void;
}

export function ThemeSelector({
  currentTheme,
  storeName,
  storeId,
  logo,
  onThemeChange,
}: ThemeSelectorProps) {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    currentTheme?.template || "luxury"
  );
  const [colors, setColors] = useState({
    primary: currentTheme?.colors?.primary || themeTemplates[0].colors.primary,
    secondary:
      currentTheme?.colors?.secondary || themeTemplates[0].colors.secondary,
    accent: currentTheme?.colors?.accent || themeTemplates[0].colors.accent,
    background:
      currentTheme?.colors?.background || themeTemplates[0].colors.background,
    text: currentTheme?.colors?.text || themeTemplates[0].colors.text,
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  // When template changes, update the colors
  useEffect(() => {
    const template = themeTemplates.find((t) => t.id === selectedTemplate);
    if (template) {
      setColors({
        primary: currentTheme?.colors?.primary || template.colors.primary,
        secondary: currentTheme?.colors?.secondary || template.colors.secondary,
        accent: currentTheme?.colors?.accent || template.colors.accent,
        background:
          currentTheme?.colors?.background || template.colors.background,
        text: currentTheme?.colors?.text || template.colors.text,
      });
    }
  }, [selectedTemplate, currentTheme]);

  // Combine all theme data
  const completeTheme: StoreTheme = useMemo(
    () => ({
      template: selectedTemplate as StoreTheme["template"],
      colors,
      name: storeName,
      id: storeId,
      logo,
    }),
    //eslint-disable-next-line
    [storeName, storeId, logo]
  );

  // Notify parent component of theme changes
  useEffect(() => {
    if (onThemeChange) {
      onThemeChange(completeTheme);
    }
  }, [selectedTemplate, colors, onThemeChange, completeTheme]);

  // Format theme data for URL encoding
  const getEncodedTheme = () => {
    return encodeURIComponent(JSON.stringify(completeTheme));
  };

  const handleOpenPreview = () => {
    setPreviewLoading(true);
    // In a real app, we'd first save the theme or create a temporary preview
    // For now, we'll just simulate a loading state
    setTimeout(() => {
      setPreviewLoading(false);
      setPreviewOpen(true);
    }, 1000);
  };

  const handleFullPreview = () => {
    const encodedTheme = getEncodedTheme();
    router.push(`/preview?theme=${encodedTheme}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* Theme Templates */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium mb-4">Store Template</h3>

          <RadioGroup
            value={selectedTemplate}
            onValueChange={setSelectedTemplate}
            className="space-y-3"
          >
            {themeTemplates.map((template) => (
              <div
                key={template.id}
                className={`relative rounded-lg border-2 overflow-hidden cursor-pointer transition-all hover:border-primary/70 ${
                  selectedTemplate === template.id
                    ? "border-primary"
                    : "border-muted"
                }`}
              >
                <RadioGroupItem
                  value={template.id}
                  id={template.id}
                  className="sr-only"
                />
                <label htmlFor={template.id} className="cursor-pointer block">
                  <div className="aspect-video w-full relative">
                    <Image
                      src={template.preview}
                      alt={template.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{template.name}</h4>
                      {selectedTemplate === template.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Color Configuration */}
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Color Scheme</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenPreview}
              disabled={previewLoading}
              className="gap-2"
            >
              {previewLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              Preview Theme
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="primary" className="w-full">
                <TabsList className="mb-4 w-full justify-start">
                  <TabsTrigger value="primary" className="flex-1">
                    Primary
                  </TabsTrigger>
                  <TabsTrigger value="secondary" className="flex-1">
                    Secondary
                  </TabsTrigger>
                  <TabsTrigger value="accent" className="flex-1">
                    Accent
                  </TabsTrigger>
                  <TabsTrigger value="background" className="flex-1">
                    Background
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex-1">
                    Text
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="primary" className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium mb-1">Primary Color</h4>
                      <p className="text-sm text-muted-foreground">
                        Used for buttons, headings, and important elements
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-6 w-6 rounded-md border"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <Input
                        value={colors.primary}
                        onChange={(e) =>
                          setColors({ ...colors, primary: e.target.value })
                        }
                        className="w-24 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <ColorPreview colors={colors} type="primary" />

                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {[
                      "#8A6D3B",
                      "#E63946",
                      "#2C3E50",
                      "#6C63FF",
                      "#333333",
                    ].map((color, i) => (
                      <TooltipProvider key={i}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="h-8 w-full rounded-md border transition-all hover:scale-105"
                              style={{ backgroundColor: color }}
                              onClick={() =>
                                setColors({ ...colors, primary: color })
                              }
                            ></button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span className="font-mono text-xs">{color}</span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="secondary" className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium mb-1">Secondary Color</h4>
                      <p className="text-sm text-muted-foreground">
                        Used for secondary elements, backgrounds, and borders
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-6 w-6 rounded-md border"
                        style={{ backgroundColor: colors.secondary }}
                      />
                      <Input
                        value={colors.secondary}
                        onChange={(e) =>
                          setColors({ ...colors, secondary: e.target.value })
                        }
                        className="w-24 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <ColorPreview colors={colors} type="secondary" />

                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {[
                      "#F0EAD6",
                      "#1D3557",
                      "#ECF0F1",
                      "#F5F5F5",
                      "#FFFFFF",
                    ].map((color, i) => (
                      <TooltipProvider key={i}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="h-8 w-full rounded-md border transition-all hover:scale-105"
                              style={{ backgroundColor: color }}
                              onClick={() =>
                                setColors({ ...colors, secondary: color })
                              }
                            ></button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span className="font-mono text-xs">{color}</span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="accent" className="space-y-4">
                  {/* Similar structure for accent color */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium mb-1">Accent Color</h4>
                      <p className="text-sm text-muted-foreground">
                        Used for highlights, hover states, and call-to-actions
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-6 w-6 rounded-md border"
                        style={{ backgroundColor: colors.accent }}
                      />
                      <Input
                        value={colors.accent}
                        onChange={(e) =>
                          setColors({ ...colors, accent: e.target.value })
                        }
                        className="w-24 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <ColorPreview colors={colors} type="accent" />

                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {[
                      "#DFD7BF",
                      "#457B9D",
                      "#3498DB",
                      "#FF6584",
                      "#CCCCCC",
                    ].map((color, i) => (
                      <TooltipProvider key={i}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="h-8 w-full rounded-md border transition-all hover:scale-105"
                              style={{ backgroundColor: color }}
                              onClick={() =>
                                setColors({ ...colors, accent: color })
                              }
                            ></button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span className="font-mono text-xs">{color}</span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="background" className="space-y-4">
                  {/* Similar structure for background color */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium mb-1">Background Color</h4>
                      <p className="text-sm text-muted-foreground">
                        Main background color for your store
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-6 w-6 rounded-md border"
                        style={{ backgroundColor: colors.background }}
                      />
                      <Input
                        value={colors.background}
                        onChange={(e) =>
                          setColors({ ...colors, background: e.target.value })
                        }
                        className="w-24 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <ColorPreview colors={colors} type="background" />

                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {[
                      "#FFFFFF",
                      "#F1FAEE",
                      "#FFFFFF",
                      "#FFFFFF",
                      "#F8F8F8",
                    ].map((color, i) => (
                      <TooltipProvider key={i}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="h-8 w-full rounded-md border transition-all hover:scale-105"
                              style={{ backgroundColor: color }}
                              onClick={() =>
                                setColors({ ...colors, background: color })
                              }
                            ></button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span className="font-mono text-xs">{color}</span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  {/* Similar structure for text color */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium mb-1">Text Color</h4>
                      <p className="text-sm text-muted-foreground">
                        Main text color for your store
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-6 w-6 rounded-md border"
                        style={{ backgroundColor: colors.text }}
                      />
                      <Input
                        value={colors.text}
                        onChange={(e) =>
                          setColors({ ...colors, text: e.target.value })
                        }
                        className="w-24 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <ColorPreview colors={colors} type="text" />

                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {[
                      "#333333",
                      "#1D3557",
                      "#2C3E50",
                      "#333333",
                      "#333333",
                    ].map((color, i) => (
                      <TooltipProvider key={i}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="h-8 w-full rounded-md border transition-all hover:scale-105"
                              style={{ backgroundColor: color }}
                              onClick={() =>
                                setColors({ ...colors, text: color })
                              }
                            ></button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span className="font-mono text-xs">{color}</span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-6xl w-[95vw] h-[80vh] p-0 overflow-hidden">
          <DialogHeader className="absolute top-0 right-0 z-50 p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreviewOpen(false)}
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="h-full w-full overflow-y-auto">
            <ThemePreview theme={completeTheme} />
          </div>

          <div className="absolute bottom-4 right-4 z-50">
            <Button onClick={handleFullPreview} className="gap-2 shadow-lg">
              Full Preview
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper component to preview how colors look together
function ColorPreview({
  colors,
  type,
}: {
  colors: StoreTheme["colors"];
  type: keyof StoreTheme["colors"];
}) {
  return (
    <div
      className="p-4 rounded-md border"
      style={{ backgroundColor: colors.background }}
    >
      <div className="flex flex-col space-y-3">
        {type === "primary" && (
          <>
            <div
              className="rounded-md p-2 text-sm font-medium text-center"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              Primary Button
            </div>
            <h3
              className="text-lg font-medium"
              style={{ color: colors.primary }}
            >
              This is a heading in primary color
            </h3>
          </>
        )}

        {type === "secondary" && (
          <>
            <div
              className="rounded-md p-2 text-sm font-medium text-center"
              style={{ backgroundColor: colors.secondary, color: colors.text }}
            >
              Secondary Element
            </div>
            <div
              className="rounded-md border p-3"
              style={{
                borderColor: colors.secondary,
                backgroundColor: colors.secondary + "20",
              }}
            >
              <p className="text-sm" style={{ color: colors.text }}>
                Content with secondary background
              </p>
            </div>
          </>
        )}

        {type === "accent" && (
          <>
            <div
              className="rounded-md p-2 text-sm font-medium text-center"
              style={{
                backgroundColor: colors.accent,
                color: colors.background,
              }}
            >
              Accent Button
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: colors.accent }}
              ></div>
              <p className="text-sm" style={{ color: colors.accent }}>
                Text in accent color
              </p>
            </div>
          </>
        )}

        {type === "background" && (
          <div
            className="rounded-md p-4"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.secondary}`,
            }}
          >
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: colors.primary }}
            >
              Content Section
            </h3>
            <p className="text-sm" style={{ color: colors.text }}>
              This is how content looks on your background color
            </p>
          </div>
        )}

        {type === "text" && (
          <div className="space-y-2">
            <p className="text-base" style={{ color: colors.text }}>
              This is your main text color
            </p>
            <p className="text-sm" style={{ color: colors.text + "99" }}>
              Secondary text with opacity
            </p>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: colors.text }}
              ></div>
              <span className="text-xs" style={{ color: colors.text }}>
                Small text in this color
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Theme Preview Component
function ThemePreview({ theme }: { theme: StoreTheme }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading the template
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Loading preview...</p>
        </div>
      </div>
    );
  }

  // Render the appropriate template preview based on the selected theme
  const templateId = theme.template || "luxury";

  switch (templateId) {
    case "luxury":
      return <LuxuryPreview theme={theme} />;
    case "bold":
      return <BoldPreview theme={theme} />;
    case "classic":
      return <ClassicPreview theme={theme} />;
    case "modern":
      return <ModernPreview theme={theme} />;
    case "minimal":
      return <MinimalPreview theme={theme} />;
    default:
      return <LuxuryPreview theme={theme} />;
  }
}

// Example of one theme preview component (you would create one for each theme)
function LuxuryPreview({ theme }: { theme: StoreTheme }) {
  const { colors } = theme;

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <header
        className="border-b sticky top-0 z-40 backdrop-blur-md bg-opacity-50"
        style={{ borderColor: colors.secondary + "40" }}
      >
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div
            className="text-2xl font-serif font-bold"
            style={{ color: colors.primary }}
          >
            {theme.name}
          </div>

          <nav className="hidden md:flex space-x-6">
            {["Home", "Products", "Collections", "About"].map((item, i) => (
              <a
                key={i}
                href="#"
                className="text-sm font-medium hover:opacity-70 transition-opacity"
                style={{ color: colors.text }}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {["search", "user", "bag"].map((icon, i) => (
              <button
                key={i}
                className="p-2 rounded-full transition-colors"
                style={{
                  color: colors.text,
                  //@ts-expect-error
                  "&:hover": { backgroundColor: colors.primary + "10" },
                }}
              >
                <div className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="h-[60vh] relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/api/placeholder/1200/800"
              alt="Luxury store banner"
              fill
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"
              aria-hidden="true"
            />
          </div>

          <div className="relative h-full flex flex-col justify-end container mx-auto px-4 md:px-6 pb-20">
            <h1 className="text-4xl md:text-6xl font-serif font-light text-white max-w-3xl">
              Timeless elegance for the discerning customer
            </h1>

            <div className="mt-8">
              <button
                className="px-8 py-4 text-sm font-medium transition-all"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                Explore Collection
              </button>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center mb-16">
            <h2
              className="text-3xl font-serif mb-4"
              style={{ color: colors.primary }}
            >
              Featured Collection
            </h2>
            <div
              className="w-16 h-px"
              style={{ backgroundColor: colors.primary }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group">
                <div className="relative aspect-square overflow-hidden mb-4 bg-muted">
                  <Image
                    src={`/api/placeholder/400/${400 + i * 20}`}
                    alt="Product"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3
                  className="text-lg font-medium"
                  style={{ color: colors.text }}
                >
                  Product Name
                </h3>
                <p
                  className="text-sm mt-1"
                  style={{ color: colors.text + "90" }}
                >
                  $299.00
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section
          className="py-20"
          style={{ backgroundColor: colors.secondary + "30" }}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center mb-16">
              <h2
                className="text-3xl font-serif mb-4"
                style={{ color: colors.primary }}
              >
                Shop by Category
              </h2>
              <div
                className="w-16 h-px"
                style={{ backgroundColor: colors.primary }}
              ></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Clothing", "Accessories", "Footwear", "Home"].map(
                (category, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden group"
                  >
                    <Image
                      src={`/api/placeholder/${400 + i * 30}/${450 + i * 20}`}
                      alt={category}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all">
                      <h3 className="text-xl font-serif text-white">
                        {category}
                      </h3>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </main>

      <footer
        className="border-t py-12"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.secondary + "40",
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3
                className="font-medium text-lg mb-4"
                style={{ color: colors.primary }}
              >
                {theme.name}
              </h3>
              <p className="text-sm" style={{ color: colors.text + "70" }}>
                Luxury shopping experience with a focus on quality and design.
              </p>
            </div>

            {/* Footer columns */}
            {[
              {
                title: "Shopping",
                links: ["All Products", "New Arrivals", "Best Sellers", "Sale"],
              },
              {
                title: "Info",
                links: ["About Us", "Contact", "Shipping", "Returns"],
              },
              {
                title: "Follow Us",
                links: ["Instagram", "Facebook", "Twitter", "Pinterest"],
              },
            ].map((col, i) => (
              <div key={i}>
                <h3
                  className="font-medium text-sm mb-4"
                  style={{ color: colors.text }}
                >
                  {col.title}
                </h3>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-sm hover:opacity-70 transition-opacity"
                        style={{ color: colors.text + "70" }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="mt-12 pt-8 border-t text-sm"
            style={{
              borderColor: colors.secondary + "40",
              color: colors.text + "70",
            }}
          >
            © {new Date().getFullYear()} {theme.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Additional theme previews (similar structure with different styling)
function BoldPreview({ theme }: { theme: StoreTheme }) {
  const { colors } = theme;

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <header
        className="sticky top-0 z-40 py-4"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#fff" }}
          >
            {theme.name}
          </div>

          <nav className="hidden md:flex space-x-6">
            {["Home", "Products", "Collections", "About"].map((item, i) => (
              <a
                key={i}
                href="#"
                className="text-sm font-bold uppercase hover:opacity-70 transition-opacity"
                style={{ color: "#fff" }}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {["search", "user", "bag"].map((icon, i) => (
              <button
                key={i}
                className="p-2 rounded-full transition-colors"
                style={{ color: "#fff" }}
              >
                <div className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="h-[60vh] relative">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            <div
              className="flex flex-col justify-center px-6 md:px-12 py-12"
              style={{ backgroundColor: colors.primary }}
            >
              <div
                className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-6"
                style={{ backgroundColor: colors.accent, color: "#fff" }}
              >
                New Collection
              </div>
              <h1
                className="text-4xl md:text-6xl font-bold mb-6"
                style={{ color: "#fff" }}
              >
                Bold styles for bold personalities
              </h1>
              <p className="text-lg mb-8" style={{ color: "#fff" + "CC" }}>
                Discover our latest arrivals that make a statement.
              </p>
              <div>
                <button
                  className="px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all"
                  style={{
                    backgroundColor: colors.secondary,
                    color: "#fff",
                  }}
                >
                  Shop Now
                </button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <Image
                src="/api/placeholder/800/900"
                alt="Bold fashion"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 container mx-auto px-4 md:px-6">
          <div className="flex flex-col mb-12">
            <h2
              className="text-4xl font-bold"
              style={{ color: colors.primary }}
            >
              Trending Now
            </h2>
            <div
              className="w-24 h-1 mt-4"
              style={{ backgroundColor: colors.accent }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group">
                <div className="relative aspect-square overflow-hidden mb-4 bg-muted">
                  <Image
                    src={`/api/placeholder/500/${500 + i * 20}`}
                    alt="Product"
                    fill
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    style={{ backgroundColor: colors.primary + "CC" }}
                  >
                    <button
                      className="px-6 py-2 text-sm font-bold"
                      style={{
                        backgroundColor: colors.accent,
                        color: "#fff",
                      }}
                    >
                      Quick View
                    </button>
                  </div>
                </div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: colors.text }}
                >
                  Bold Product
                </h3>
                <p
                  className="text-sm mt-1 font-medium"
                  style={{ color: colors.primary }}
                >
                  $199.00
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer
        className="py-12"
        style={{
          backgroundColor: colors.secondary,
          color: "#fff",
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4" style={{ color: "#fff" }}>
                {theme.name}
              </h3>
              <p className="text-sm" style={{ color: "#fff" + "CC" }}>
                Bold designs for the modern shopper.
              </p>
            </div>

            {/* Footer columns */}
            {[
              {
                title: "Shop",
                links: ["New Arrivals", "Bestsellers", "Sale", "Collections"],
              },
              {
                title: "Company",
                links: ["About Us", "Contact", "Careers", "Press"],
              },
              {
                title: "Connect",
                links: ["Instagram", "TikTok", "Twitter", "Facebook"],
              },
            ].map((col, i) => (
              <div key={i}>
                <h3
                  className="font-bold text-sm uppercase tracking-wider mb-4"
                  style={{ color: colors.accent }}
                >
                  {col.title}
                </h3>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-sm hover:opacity-70 transition-opacity"
                        style={{ color: "#fff" + "CC" }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="mt-12 pt-8 border-t text-sm"
            style={{
              borderColor: "#fff" + "20",
              color: "#fff" + "80",
            }}
          >
            © {new Date().getFullYear()} {theme.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Add other theme previews (Classic, Modern, Minimal) with similar structure but different styling
function ClassicPreview({ theme }: { theme: StoreTheme }) {
  // Implementation similar to above with classic styling...
  // For brevity, I'm showing a placeholder
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-serif mb-4">Classic Theme Preview</h2>
        <p>This would be a full implementation of the classic theme.</p>
      </div>
    </div>
  );
}

function ModernPreview({ theme }: { theme: StoreTheme }) {
  // Implementation similar to above with modern styling...
  // For brevity, I'm showing a placeholder
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-sans mb-4">Modern Theme Preview</h2>
        <p>This would be a full implementation of the modern theme.</p>
      </div>
    </div>
  );
}

function MinimalPreview({ theme }: { theme: StoreTheme }) {
  // Implementation similar to above with minimal styling...
  // For brevity, I'm showing a placeholder
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-sans mb-4">Minimal Theme Preview</h2>
        <p>This would be a full implementation of the minimal theme.</p>
      </div>
    </div>
  );
}
