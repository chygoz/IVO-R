"use client";
import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Paintbrush,
  Check,
} from "lucide-react";

import { IVariant, ProductSize, IGallery } from "@/store/product-store";
import { ColorPicker } from "@/components/ui/color-wheel";
import { Badge } from "@/components/ui/badge";
import { MediaGalleryManager } from "@/components/ui/media-gallery-manager";
import { InputQuantity } from "@/components/ui/input-quantity";
import Image from "next/image";

// Mock available sizes and colors
const availableSizes = [
  { code: "6", name: "6", displayName: "Size 6", sortOrder: 1 },
  { code: "8", name: "8", displayName: "Size 8", sortOrder: 2 },
  { code: "10", name: "10", displayName: "Size 10", sortOrder: 3 },
  { code: "12", name: "12", displayName: "Size 12", sortOrder: 4 },
  { code: "14", name: "14", displayName: "Size 14", sortOrder: 5 },
  { code: "16", name: "16", displayName: "Size 16", sortOrder: 6 },
  { code: "18", name: "18", displayName: "Size 18", sortOrder: 7 },
  { code: "20", name: "20", displayName: "Size 20", sortOrder: 8 },
];

interface VariantManagerProps {
  onChange: (variants: IVariant[]) => void;
  initialVariants?: IVariant[];
  productCode?: string;
}

interface ColorGroup {
  color: {
    name: string;
    code: string;
    hex: string;
  };
  variants: IVariant[];
  gallery: IGallery[]; // Images at color level
}

export function VariantManager({
  onChange,
  initialVariants = [],
  productCode = "PROD",
}: VariantManagerProps) {
  const { toast } = useToast();
  const [variants, setVariants] = useState<IVariant[]>(initialVariants);
  const [colorGroups, setColorGroups] = useState<ColorGroup[]>([]);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [newColor, setNewColor] = useState({
    name: "",
    hex: "#000000",
  });
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [currentColorForGallery, setCurrentColorForGallery] = useState<
    string | null
  >(null);

  // Size management
  const [isAddingSize, setIsAddingSize] = useState(false);
  const [selectedVariantForSize, setSelectedVariantForSize] = useState<
    string | null
  >(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeQuantity, setSizeQuantity] = useState<number>(1);

  // Add a ref to track if we need to notify the parent of changes
  const shouldNotifyParent = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group variants by color and create color groups
  useEffect(() => {
    const groups: ColorGroup[] = [];
    const colorMap = new Map<string, ColorGroup>();

    variants.forEach((variant) => {
      const colorKey = variant.code;

      if (!colorMap.has(colorKey)) {
        colorMap.set(colorKey, {
          color: {
            name: variant.name,
            code: variant.code,
            hex: variant.hex,
          },
          variants: [],
          gallery: [],
        });
      }

      // Add variant to its color group
      colorMap.get(colorKey)!.variants.push({ ...variant });

      // If the variant has images and the color group doesn't yet, use these images
      if (
        variant.gallery?.length > 0 &&
        colorMap.get(colorKey)!.gallery.length === 0
      ) {
        colorMap.get(colorKey)!.gallery = [...variant.gallery];
      }
    });

    colorMap.forEach((group) => {
      groups.push(group);
    });

    setColorGroups(groups);
  }, [variants]);

  // When color groups change, notify the parent component if needed
  useEffect(() => {
    if (shouldNotifyParent.current && colorGroups.length > 0) {
      const normalizedVariants = variants.map((variant) => {
        // Find the color group for this variant
        const colorGroup = colorGroups.find(
          (group) => group.color.code === variant.code
        );

        // If color group exists, use its gallery for all variants of this color
        if (colorGroup) {
          return {
            ...variant,
            gallery: colorGroup.gallery,
          };
        }

        return variant;
      });

      onChange(normalizedVariants);
      shouldNotifyParent.current = false;
    }
  }, [colorGroups, onChange, variants]);

  // Generate a code from the color name
  const generateColorCode = (name: string): string => {
    // Take first 2-3 letters of the color name
    return name.slice(0, 3).toLowerCase();
  };

  // Generate SKU
  const generateSku = (colorCode: string, sizeCode: string): string => {
    const randomDigits = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    return `${productCode}-${colorCode.toUpperCase()}-${sizeCode}-${randomDigits}`;
  };

  // Handle adding a new color
  const handleAddColor = () => {
    if (!newColor.name || !newColor.hex) {
      toast({
        title: "Missing color information",
        description: "Please provide a name and color hex code",
        variant: "destructive",
      });
      return;
    }

    const colorCode = generateColorCode(newColor.name);

    // Check if color code already exists
    if (
      colorGroups.some(
        (group) => group.color.code.toLowerCase() === colorCode.toLowerCase()
      )
    ) {
      toast({
        title: "Color already exists",
        description: "A similar color code already exists",
        variant: "destructive",
      });
      return;
    }

    // Create new variant with a unique ID
    const newVariantId = `v-${Date.now()}`;

    // Add a new variant with the new color
    const newVariant: IVariant = {
      _id: newVariantId,
      name: newColor.name,
      code: colorCode,
      hex: newColor.hex,
      sizes: [],
      status: "in-stock",
      gallery: [],
      active: true,
    };

    // Add new variant to the list
    shouldNotifyParent.current = true;
    setVariants((prevVariants) => [...prevVariants, newVariant]);

    // Reset form and close dialog
    setNewColor({ name: "", hex: "#000000" });
    setIsAddingColor(false);

    // Set the new color as active (we'll do this after color groups update)
    setTimeout(() => {
      setActiveColorIndex(colorGroups.length);

      // Open size dialog automatically for the new color
      setSelectedVariantForSize(newVariantId);
      setIsAddingSize(true);
    }, 100);

    toast({
      title: "Color added",
      description: `${newColor.name} has been added, now add some sizes`,
    });
  };

  // Handle adding a size to variant
  const handleAddSize = () => {
    if (!selectedVariantForSize || !selectedSize || sizeQuantity < 1) {
      toast({
        title: "Missing information",
        description: "Please select a size and specify a quantity",
        variant: "destructive",
      });
      return;
    }

    // Find the variant
    const variant = variants.find((v) => v._id === selectedVariantForSize);
    if (!variant) return;

    // Check if this size already exists in the variant
    if (variant.sizes.some((s) => s.code === selectedSize)) {
      toast({
        title: "Size already exists",
        description: "This size already exists for this color",
        variant: "destructive",
      });
      return;
    }

    // Find the size details from available sizes
    const sizeDetails = availableSizes.find((s) => s.code === selectedSize);
    if (!sizeDetails) return;

    // Create new size
    const newSize: ProductSize = {
      name: sizeDetails.name,
      code: sizeDetails.code,
      displayName: sizeDetails.displayName,
      sortOrder: sizeDetails.sortOrder,
      quantity: sizeQuantity,
      status: "in-stock",
      active: true,
      sku: generateSku(variant.code, sizeDetails.code),
    };

    // Update the variant with the new size
    shouldNotifyParent.current = true;
    setVariants((prevVariants) =>
      prevVariants.map((v) => {
        if (v._id === selectedVariantForSize) {
          return {
            ...v,
            sizes: [...v.sizes, newSize],
          };
        }
        return v;
      })
    );

    // Reset and close size dialog
    toast({
      title: "Size added",
      description: `${sizeDetails.displayName} added to ${variant.name}`,
    });

    // Reset the form but keep the dialog open for adding more sizes
    setSelectedSize("");
    setSizeQuantity(1);
  };

  // Handle removing a size from a variant
  const handleRemoveVariantSize = (variantId: string, sizeCode: string) => {
    shouldNotifyParent.current = true;
    setVariants((prevVariants) =>
      prevVariants.map((v) => {
        if (v._id === variantId) {
          return {
            ...v,
            sizes: v.sizes.filter((s) => s.code !== sizeCode),
          };
        }
        return v;
      })
    );

    toast({
      title: "Size removed",
      description: "The size has been removed",
    });
  };

  // Handle removing a color group
  const handleRemoveColorGroup = (colorCode: string) => {
    // Remove the variant with this color
    shouldNotifyParent.current = true;
    setVariants((prevVariants) =>
      prevVariants.filter((v) => v.code !== colorCode)
    );

    toast({
      title: "Color removed",
      description: "The color and all its sizes have been removed",
    });
  };

  // Handle updating variant quantity
  const handleUpdateSizeQuantity = (
    variantId: string,
    sizeCode: string,
    quantity: number
  ) => {
    shouldNotifyParent.current = true;
    setVariants((prevVariants) =>
      prevVariants.map((v) => {
        if (v._id === variantId) {
          return {
            ...v,
            sizes: v.sizes.map((s) =>
              s.code === sizeCode ? { ...s, quantity } : s
            ),
          };
        }
        return v;
      })
    );
  };

  // Handle opening the gallery modal
  const handleOpenGallery = (colorCode: string) => {
    setCurrentColorForGallery(colorCode);
    setIsGalleryModalOpen(true);
  };

  // Handle removing an image from a color
  const handleRemoveColorImage = (colorCode: string, imageIndex: number) => {
    // Find the color group
    const colorGroup = colorGroups.find(
      (group) => group.color.code === colorCode
    );
    if (!colorGroup) return;

    // Update the color group's gallery
    const updatedGallery = [...colorGroup.gallery];
    updatedGallery.splice(imageIndex, 1);

    const updatedColorGroups = colorGroups.map((group) =>
      group.color.code === colorCode
        ? { ...group, gallery: updatedGallery }
        : group
    );

    setColorGroups(updatedColorGroups);

    // Update all variants of this color to share the same gallery
    shouldNotifyParent.current = true;
    setVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant.code === colorCode
          ? { ...variant, gallery: updatedGallery }
          : variant
      )
    );

    toast({
      title: "Image removed",
      description: "The image has been removed from this color",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Product Variants</h3>
        <Dialog open={isAddingColor} onOpenChange={setIsAddingColor}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1" type="button">
              <Paintbrush className="h-4 w-4" />
              <span>Add Color</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Color</DialogTitle>
              <DialogDescription>
                Add a new color for your product variants
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="colorName">Color Name</Label>
                <Input
                  id="colorName"
                  placeholder="Blue"
                  value={newColor.name}
                  onChange={(e) =>
                    setNewColor({ ...newColor, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="colorHex">Color</Label>
                <ColorPicker
                  value={newColor.hex}
                  onChange={(color) => setNewColor({ ...newColor, hex: color })}
                  placeholder="#000000"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Choose a color or enter a hex code (e.g., #FF0000 for red)
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddingColor(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button onClick={handleAddColor} type="button">
                Add Color
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Size Selection Sheet (Mobile-friendly) */}
      <Sheet open={isAddingSize} onOpenChange={setIsAddingSize}>
        <SheetContent side="bottom" className="h-auto sm:max-w-md sm:h-full">
          <SheetHeader>
            <SheetTitle>Add Size</SheetTitle>
            <SheetDescription>
              Add a new size for this color variant
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-4">
            {selectedVariantForSize && (
              <div>
                {variants.find((v) => v._id === selectedVariantForSize) && (
                  <div className="flex items-center mb-4">
                    <div
                      className="h-4 w-4 rounded-full mr-2"
                      style={{
                        backgroundColor: variants.find(
                          (v) => v._id === selectedVariantForSize
                        )?.hex,
                      }}
                    />
                    <span className="capitalize font-medium">
                      {
                        variants.find((v) => v._id === selectedVariantForSize)
                          ?.name
                      }
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Select
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                    >
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Filter out sizes that are already in use for this variant */}
                        {availableSizes
                          .filter((size) => {
                            const variant = variants.find(
                              (v) => v._id === selectedVariantForSize
                            );
                            return !variant?.sizes.some(
                              (s) => s.code === size.code
                            );
                          })
                          .map((size) => (
                            <SelectItem key={size.code} value={size.code}>
                              {size.displayName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <InputQuantity
                      id="quantity"
                      value={sizeQuantity}
                      onChange={(value) => setSizeQuantity(value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingSize(false)}
                      type="button"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={handleAddSize}
                      type="button"
                      disabled={!selectedSize || sizeQuantity < 1}
                    >
                      Add Size
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {colorGroups.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Paintbrush className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No colors added yet</h3>
          <p className="mt-2 text-muted-foreground">
            Start by adding a color for your product variants
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setIsAddingColor(true)}
            type="button"
          >
            <Paintbrush className="h-4 w-4 mr-2" />
            Add First Color
          </Button>
        </div>
      ) : (
        <Tabs
          value={String(activeColorIndex)}
          onValueChange={(value) => setActiveColorIndex(Number(value))}
        >
          <TabsList className="mb-4 flex flex-wrap">
            {colorGroups.map((group, index) => (
              <TabsTrigger
                key={index}
                value={String(index)}
                className="flex items-center"
              >
                <div
                  className="h-4 w-4 rounded-full mr-2"
                  style={{ backgroundColor: group.color.hex }}
                />
                <span className="capitalize">{group.color.name}</span>
                <span className="ml-2 text-muted-foreground">
                  (
                  {group.variants.length > 0
                    ? group.variants[0]?.sizes?.length
                    : 0}
                  )
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {colorGroups.map((group, colorIndex) => (
            <TabsContent
              key={colorIndex}
              value={String(colorIndex)}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div
                    className="h-6 w-6 rounded-full mr-2"
                    style={{ backgroundColor: group.color.hex }}
                  />
                  <h4 className="font-medium capitalize">{group.color.name}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      // Find the variant ID for this color
                      const variant = variants.find(
                        (v) => v.code === group.color.code
                      );
                      if (variant) {
                        setSelectedVariantForSize(variant._id);
                        setIsAddingSize(true);
                      }
                    }}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Size</span>
                  </Button>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() =>
                            handleRemoveColorGroup(group.color.code)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove {group.color.name} variant</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Color images section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="text-sm font-medium">Color Images</h5>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    type="button"
                    onClick={() => handleOpenGallery(group.color.code)}
                  >
                    <Upload className="h-4 w-4" />
                    Manage Images
                  </Button>
                </div>

                {group.gallery.length === 0 ? (
                  <div className="border rounded-lg border-dashed p-8 text-center bg-gray-50">
                    <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No images uploaded for this color
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 1200×1600px, max 5MB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      type="button"
                      onClick={() => handleOpenGallery(group.color.code)}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload Images
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {group.gallery.slice(0, 4).map((image, index) => (
                      <div key={image._id} className="relative group">
                        <div className="aspect-[3/4] rounded-md overflow-hidden border">
                          <Image
                            width={400}
                            height={400}
                            src={image.url}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            className="text-white hover:text-white hover:bg-red-500"
                            onClick={() =>
                              handleRemoveColorImage(group.color.code, index)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {index === 0 && (
                          <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-sm text-xs text-white">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    ))}

                    {group.gallery.length > 4 && (
                      <div
                        className="aspect-[3/4] rounded-md overflow-hidden border flex items-center justify-center bg-gray-50 cursor-pointer"
                        onClick={() => handleOpenGallery(group.color.code)}
                      >
                        <div className="text-center">
                          <Plus className="h-6 w-6 mx-auto text-gray-400" />
                          <p className="text-sm text-muted-foreground mt-1">
                            +{group.gallery.length - 4} more
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Size variants section */}
              <div className="space-y-2">
                {!variants.find((v) => v.code === group.color.code)?.sizes
                  ?.length ? (
                  <div className="text-center py-8 border rounded-lg bg-gray-50">
                    <p className="text-muted-foreground">
                      No sizes added for this color yet
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="mt-2"
                      onClick={() => {
                        const variant = variants.find(
                          (v) => v.code === group.color.code
                        );
                        if (variant) {
                          setSelectedVariantForSize(variant._id);
                          setIsAddingSize(true);
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Size
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Mobile view - Size Accordion */}
                    <div className="md:hidden">
                      <Accordion type="single" collapsible className="w-full">
                        {variants
                          .find((v) => v.code === group.color.code)
                          ?.sizes.map((size, sizeIndex) => (
                            <AccordionItem
                              key={`${group.color.code}-${size.code}`}
                              value={`size-${sizeIndex}`}
                            >
                              <AccordionTrigger className="py-3 px-4 hover:no-underline hover:bg-gray-50">
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center">
                                    <div className="font-medium">
                                      {size.displayName}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={
                                        size.status === "in-stock"
                                          ? "default"
                                          : "destructive"
                                      }
                                    >
                                      {size.quantity} units
                                    </Badge>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4">
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <Label
                                        htmlFor={`sku-${size.code}`}
                                        className="text-xs text-muted-foreground"
                                      >
                                        SKU
                                      </Label>
                                      <Input
                                        id={`sku-${size.code}`}
                                        value={size.sku}
                                        className="mt-1 text-xs"
                                        readOnly
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor={`quantity-${size.code}`}
                                        className="text-xs text-muted-foreground"
                                      >
                                        Quantity
                                      </Label>
                                      <Input
                                        id={`quantity-${size.code}`}
                                        type="number"
                                        min="0"
                                        value={size.quantity}
                                        onChange={(e) => {
                                          const variant = variants.find(
                                            (v) => v.code === group.color.code
                                          );
                                          if (variant) {
                                            handleUpdateSizeQuantity(
                                              variant._id,
                                              size.code,
                                              parseInt(e.target.value) || 0
                                            );
                                          }
                                        }}
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      type="button"
                                      className="text-red-500 border-red-200 hover:border-red-500 hover:bg-red-50"
                                      onClick={() => {
                                        const variant = variants.find(
                                          (v) => v.code === group.color.code
                                        );
                                        if (variant) {
                                          handleRemoveVariantSize(
                                            variant._id,
                                            size.code
                                          );
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                      </Accordion>
                    </div>

                    {/* Desktop view - Size Table */}
                    <div className="hidden md:block">
                      <div className="bg-white rounded-lg border overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                Size
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                SKU
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                Quantity
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                Status
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {variants
                              .find((v) => v.code === group.color.code)
                              ?.sizes.sort((a, b) => a.sortOrder - b.sortOrder)
                              .map((size) => {
                                const variant = variants.find(
                                  (v) => v.code === group.color.code
                                );
                                return (
                                  <tr
                                    key={`${group.color.code}-${size.code}`}
                                    className="border-b last:border-0"
                                  >
                                    <td className="px-4 py-3 text-sm font-medium">
                                      {size.displayName}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-mono text-gray-600">
                                      {size.sku}
                                    </td>
                                    <td className="px-4 py-3">
                                      <InputQuantity
                                        min={0}
                                        size="sm"
                                        value={size.quantity}
                                        onChange={(value) => {
                                          if (variant) {
                                            handleUpdateSizeQuantity(
                                              variant._id,
                                              size.code,
                                              value
                                            );
                                          }
                                        }}
                                        className="h-8 w-20"
                                      />
                                    </td>
                                    <td className="px-4 py-3">
                                      <Badge
                                        variant={
                                          size.quantity > 0
                                            ? "default"
                                            : "destructive"
                                        }
                                      >
                                        {size.quantity > 0
                                          ? "In Stock"
                                          : "Out of Stock"}
                                      </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        type="button"
                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                        onClick={() => {
                                          if (variant) {
                                            handleRemoveVariantSize(
                                              variant._id,
                                              size.code
                                            );
                                          }
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">
                                          Remove size
                                        </span>
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Gallery Management Modal */}
      <MediaGalleryManager
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        colorCode={currentColorForGallery}
        colorName={
          colorGroups.find((g) => g.color.code === currentColorForGallery)
            ?.color.name
        }
        colorHex={
          colorGroups.find((g) => g.color.code === currentColorForGallery)
            ?.color.hex
        }
        selectedImages={
          currentColorForGallery
            ? colorGroups.find((g) => g.color.code === currentColorForGallery)
              ?.gallery || []
            : []
        }
        onImagesChange={(images, colorCode) => {
          // Update the color group's gallery
          const updatedColorGroups = colorGroups.map((group) =>
            group.color.code === colorCode
              ? { ...group, gallery: images }
              : group
          );

          setColorGroups(updatedColorGroups);

          // Update all variants of this color to share the same gallery
          shouldNotifyParent.current = true;
          setVariants((prevVariants) =>
            prevVariants.map((variant) =>
              variant.code === colorCode
                ? { ...variant, gallery: images }
                : variant
            )
          );
        }}
      />
    </div>
  );
}
