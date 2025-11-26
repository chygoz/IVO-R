"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  Package,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Truck,
  Star,
  Heart,
  Share2,
  Palette,
  Ruler,
} from "lucide-react";
import { motion } from "framer-motion";

import { useProductStore } from "@/store/product-store";
import { blankService } from "@/lib/api/blank";
import Image from "next/image";
import { capitalize } from "lodash";
import { BlankDetailSkeleton } from "@/components/skeletons/blank-detail-skeleton";

// Define interface based on your API structure
interface BlankDetail {
  _id: string;
  name: string;
  code: string;
  status: string;
  mode: string;
  slug: string;
  description: string;
  gender: string;
  category: {
    _id: string;
    name: string;
  };
  basePrice: {
    currency: string;
    value: string;
  };
  variants: {
    _id: string;
    status: string;
    active: boolean;
    name?: string;
    code?: string;
    hex?: string;
    gallery: {
      url: string;
      _id: string;
      mode?: string;
      type?: string;
      view?: string;
    }[];
    sizes: {
      name: string;
      code: string;
      displayName: string;
      status: string;
      quantity: number;
      sku: string;
    }[];
  }[];
  tags: string[];
  business?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  specifications?: {
    material?: string;
    weight?: string;
    washingInstructions?: string;
    printArea?: string;
  };
  meta?: {
    title: string;
    description: string;
  };
  details?: string[];
}

export default function BlankDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const base = `/${(pathname.split("/")[1] || "").trim()}`;
  const blankId = params.blankId as string;
  const { toast } = useToast();

  const { selectBlank, selectedBlanks } = useProductStore();

  const [blank, setBlank] = useState<BlankDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddedDialog, setShowAddedDialog] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [isAddingToSelection, setIsAddingToSelection] = useState(false);

  // Check if blank is already selected
  const isSelected = selectedBlanks.some((b) => b._id === blankId);

  // Load blank details
  useEffect(() => {
    const loadBlank = async () => {
      setIsLoading(true);
      try {
        const response = await blankService.getBlankDetails(blankId);

        if (response && response.data) {
          setBlank(response.data);

          // Set default selected variant and images
          if (response.data.variants && response.data.variants.length > 0) {
            const firstVariant = response.data.variants[0];
            setSelectedVariant(firstVariant);
            setSelectedImages(firstVariant.gallery || []);
          }
        } else {
          throw new Error("Invalid API response");
        }
      } catch (error) {
        console.error("Failed to load blank:", error);
        toast({
          title: "Error loading blank",
          description: "Failed to load blank details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBlank();
  }, [blankId, toast]);

  // Navigate back
  const handleBack = () => {
    router.push(`${base}/dashboard/products/blanks`);
  };

  // Add blank to selection
  const handleAddToSelection = async () => {
    if (!blank) return;

    setIsAddingToSelection(true);
    try {
      //@ts-expect-error
      selectBlank(blank);
      setShowAddedDialog(true);

      toast({
        title: "Added to selection",
        description: `${blank.name} has been added to your selection.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add blank to selection.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToSelection(false);
    }
  };

  // Go to customization
  const handleGoToCustomization = () => {
    router.push(`${base}/dashboard/products/blanks/customize`);
  };

  // Continue browsing
  const handleContinueBrowsing = () => {
    setShowAddedDialog(false);
    router.push(`${base}/dashboard/products/blanks`);
  };

  // Handle variant selection
  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
    setSelectedImages(variant.gallery || []);
  };

  // Get available colors
  const getAvailableColors = () => {
    if (!blank || !blank.variants) return [];

    const colorMap = new Map();
    blank.variants.forEach((variant) => {
      if (variant.hex && variant.name) {
        if (!colorMap.has(variant.code)) {
          colorMap.set(variant.code, {
            name: variant.name,
            code: variant.code,
            hex: variant.hex,
            variant: variant,
          });
        }
      }
    });

    return Array.from(colorMap.values());
  };

  // Get available sizes
  const getAvailableSizes = () => {
    if (!blank || !blank.variants) return [];

    const sizeMap = new Map();
    blank.variants.forEach((variant) => {
      variant.sizes?.forEach((size) => {
        if (!sizeMap.has(size.code)) {
          sizeMap.set(size.code, size);
        }
      });
    });

    return Array.from(sizeMap.values()).sort(
      (a: any, b: any) => a.sortOrder - b.sortOrder
    );
  };

  // Group variants by color
  const groupVariantsByColor = () => {
    if (!blank || !blank.variants) return [];

    const colorGroups: any = {};

    blank.variants.forEach((variant) => {
      const colorCode = variant.code || "default";
      if (!colorGroups[colorCode]) {
        colorGroups[colorCode] = {
          color: {
            name: variant.name || "Unknown",
            code: variant.code || "default",
            hex: variant.hex || "#000000",
          },
          variants: [],
        };
      }

      colorGroups[colorCode].variants.push(variant);
    });

    return Object.values(colorGroups);
  };

  // Calculate total stock
  const getTotalStock = () => {
    if (!blank || !blank.variants) return 0;

    return blank.variants.reduce((total, variant) => {
      return (
        total +
        (variant.sizes?.reduce(
          (sizeTotal, size) => sizeTotal + (size.quantity || 0),
          0
        ) || 0)
      );
    }, 0);
  };

  const colorGroups = groupVariantsByColor();
  const availableColors = getAvailableColors();
  const availableSizes = getAvailableSizes();
  const totalStock = getTotalStock();

  if (isLoading) {
    return <BlankDetailSkeleton />;
  }

  if (!blank) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center py-12">
        <Package className="h-12 w-12 mx-auto text-gray-400" />
        <h2 className="mt-4 text-lg font-medium">Blank Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The blank you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button variant="outline" className="mt-6" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blanks
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-6"
    >
      <div className="flex justify-between items-center flex-wrap mb-6">
        <div className="flex flex-col flex-wrap">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight capitalize">
              {blank.name}
            </h1>
          </div>

          <div className="flex flex-wrap">
            <div className="flex items-center text-muted-foreground mt-1">
              <span>Code: {blank.code}</span>
              <span className="mx-2">•</span>
              <span>
                Vendor: {capitalize(blank.business?.name || "Unknown")}
              </span>
              <span className="mx-2">•</span>
              <span>{"-"} units in stock</span>
            </div>
          </div>
        </div>

        <div className="flex  items-center gap-3">
          <Button
            onClick={handleAddToSelection}
            disabled={isSelected || isAddingToSelection}
            className={`gap-1 ${isSelected
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isAddingToSelection ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSelected ? (
              <Check className="h-4 w-4" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            {isSelected ? "Added to Selection" : "Add to Selection"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs
              defaultValue="overview"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-6 grid w-full grid-cols-3">
                <TabsTrigger
                  value="overview"
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="variants"
                  className="flex items-center gap-2"
                >
                  <Palette className="h-4 w-4" />
                  Variants ({blank.variants?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="flex items-center gap-2"
                >
                  <Ruler className="h-4 w-4" />
                  Specifications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    {/* Image Gallery */}
                    <div className="mb-6">
                      {selectedImages.length > 0 ? (
                        <Carousel className="w-full">
                          <CarouselContent>
                            {selectedImages.map((image, index) => (
                              <CarouselItem key={index}>
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                  <Image
                                    width={400}
                                    height={400}
                                    src={image.url}
                                    alt={`${blank.name} - ${index + 1}`}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          {selectedImages.length > 1 && (
                            <>
                              <CarouselPrevious />
                              <CarouselNext />
                            </>
                          )}
                        </Carousel>
                      ) : (
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Color Selection */}
                    {availableColors.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-medium text-lg mb-3">
                          Available Colors
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {availableColors.map((color, index) => (
                            <button
                              key={index}
                              onClick={() => handleVariantSelect(color.variant)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:shadow-md ${selectedVariant?.code === color.code
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                              <div
                                className="w-6 h-6 rounded-full border border-gray-200"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="text-sm font-medium capitalize">
                                {color.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div className="mb-6">
                      <h3 className="font-medium text-lg mb-2">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {blank.description}
                      </p>
                    </div>

                    {/* Tags and Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge variant="outline" className="bg-gray-50">
                        <Tag className="h-3 w-3 mr-1" />
                        {blank.category?.name}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="capitalize bg-gray-50"
                      >
                        {blank.gender}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-50">
                        <Truck className="h-3 w-3 mr-1" />
                        {blank.mode}
                      </Badge>
                      {blank.tags.map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gray-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Available Sizes */}
                    {availableSizes.length > 0 && (
                      <div>
                        <h3 className="font-medium text-lg mb-3">
                          Available Sizes
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {availableSizes.map((size: any) => (
                            <Badge
                              key={size.code}
                              variant="outline"
                              className="bg-gray-50"
                            >
                              {size.displayName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="variants">
                <Card className="shadow-sm">
                  <CardHeader className="p-6">
                    <CardTitle>Available Variants</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-6">
                      {colorGroups.map((group: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <h3 className="font-medium text-lg mb-3 flex items-center">
                            <div
                              className="h-5 w-5 rounded-full mr-2 border border-gray-200"
                              style={{ backgroundColor: group.color.hex }}
                            />
                            <span className="capitalize">
                              {group.color.name}
                            </span>
                          </h3>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {group.variants[0]?.sizes?.map((size: any) => (
                                <div
                                  key={size.sku}
                                  className="bg-white border rounded-md p-3 hover:shadow-sm transition-shadow"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">
                                      {size.displayName}
                                    </span>
                                    <Badge
                                      variant={
                                        size.status === "in-stock"
                                          ? "default"
                                          : "destructive"
                                      }
                                      className="text-xs"
                                    >
                                      {size.status === "in-stock"
                                        ? "In Stock"
                                        : "Out of Stock"}
                                    </Badge>
                                  </div>

                                  <div className="text-sm text-muted-foreground space-y-1">
                                    <div className="flex justify-between">
                                      <span>SKU:</span>
                                      <span className="font-mono text-xs">
                                        {size.sku}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Quantity:</span>
                                      <span className="font-medium">
                                        {"-"} available
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )) || (
                                  <div className="col-span-full text-center py-4 text-muted-foreground">
                                    No size information available
                                  </div>
                                )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications">
                <Card className="shadow-sm">
                  <CardHeader className="p-6">
                    <CardTitle>Product Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-6">
                      {blank.specifications ? (
                        <>
                          {blank.specifications.material && (
                            <div>
                              <h3 className="font-medium text-lg mb-2">
                                Material
                              </h3>
                              <p className="text-muted-foreground">
                                {blank.specifications.material}
                              </p>
                            </div>
                          )}

                          {blank.specifications.weight && (
                            <div>
                              <h3 className="font-medium text-lg mb-2">
                                Weight
                              </h3>
                              <p className="text-muted-foreground">
                                {blank.specifications.weight}
                              </p>
                            </div>
                          )}

                          {blank.specifications.washingInstructions && (
                            <div>
                              <h3 className="font-medium text-lg mb-2">
                                Washing Instructions
                              </h3>
                              <p className="text-muted-foreground">
                                {blank.specifications.washingInstructions}
                              </p>
                            </div>
                          )}

                          {blank.specifications.printArea && (
                            <div>
                              <h3 className="font-medium text-lg mb-2">
                                Print Area
                              </h3>
                              <p className="text-muted-foreground">
                                {blank.specifications.printArea}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No specifications available for this product.</p>
                        </div>
                      )}

                      {blank.details && blank.details.length > 0 && (
                        <div>
                          <h3 className="font-medium text-lg mb-2">
                            Additional Details
                          </h3>
                          <ul className="space-y-1 text-muted-foreground">
                            {blank.details.map((detail, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Pricing Card */}
          <Card className="shadow-sm">
            <CardHeader className="p-6">
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div>
                <div className="text-3xl font-bold text-blue-700">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: blank.basePrice.currency,
                  }).format(Number(blank.basePrice.value))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Base price per unit
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  When you add this blank to your store, you can set your own
                  retail price to include your profit margin.
                </p>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              <Button
                onClick={handleAddToSelection}
                disabled={isSelected || isAddingToSelection}
                className={`w-full gap-1 ${isSelected
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {isAddingToSelection ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isSelected ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                {isSelected ? "Added to Selection" : "Add to Selection"}
              </Button>
            </CardFooter>
          </Card>

          {/* Features Card */}
          <Card className="shadow-sm">
            <CardHeader className="p-6">
              <CardTitle>Customization Benefits</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">No minimum order</p>
                  <p className="text-sm text-muted-foreground">
                    Add as many or as few as you need
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Quality guaranteed</p>
                  <p className="text-sm text-muted-foreground">
                    Premium materials and craftsmanship
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Fast fulfillment</p>
                  <p className="text-sm text-muted-foreground">
                    Quick processing and shipping
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Information */}
          <Card className="shadow-sm">
            <CardHeader className="p-6">
              <CardTitle>Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Total Stock:
                </span>
                <span className="font-medium">{"-"} units</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Available Colors:
                </span>
                <span className="font-medium">{availableColors.length}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Added to selection dialog */}
      <Dialog open={showAddedDialog} onOpenChange={setShowAddedDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Added to Selection
            </DialogTitle>
            <DialogDescription>
              &quot;{blank.name}&quot; has been added to your selection
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-md bg-blue-50 p-4 border border-blue-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ShoppingBag className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Ready to Customize
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      You can continue browsing blanks or proceed to customize
                      your selection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleContinueBrowsing}>
              Continue Browsing
            </Button>
            <Button
              onClick={handleGoToCustomization}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Customize Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
