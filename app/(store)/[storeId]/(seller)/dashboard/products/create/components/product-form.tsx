"use client";

import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";

// Individual UI component imports
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import {
  AlertTriangle,
  Book,
  DollarSign,
  ExternalLink,
  HelpCircle,
  Info,
  ListFilter,
  Package2,
  PanelLeft,
  ScrollText,
  Settings,
  Tag,
  Truck,
  Plus,
  CheckCircle2,
  Save,
  Send,
  Loader2,
} from "lucide-react";

// Lazy load the heavy VariantManager component
const VariantManager = lazy(() => import("./variant-manager").then(module => ({ default: module.VariantManager })));
import { CategorySelect } from "@/components/ui/category-select";
import { CollectionSelect } from "@/components/ui/collection-select";
import { PriceInput } from "@/components/ui/price-input";

// Form schema using Zod
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  gender: z.enum(["men", "women", "unisex"]),
  mode: z.enum(["on-sale", "pre-order", "available"]),
  basePrice: z.object({
    currency: z.string(),
    value: z.string().min(1, "Price is required"),
  }),
  collectionId: z.string().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
  }),
  shipping: z.object({
    weight: z.string().optional(),
    dimensions: z.object({
      length: z.string().optional(),
      width: z.string().optional(),
      height: z.string().optional(),
    }),
  }),
  // These fields are handled separately
  variants: z.array(z.any()).optional().refine(
    (variants) => {
      if (!variants || variants.length === 0) return true; // No variants, no image requirement
      return variants.some((variant: any) => variant.gallery && variant.gallery.length > 0);
    },
    {
      message: "At least one variant must have an image uploaded.",
      path: ["variants"],
    }
  ),
  tags: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initialData?: any;
  onSaveDraft: (data: any) => void;
  onSubmitForApproval: (data: any) => void;
  onFormChange?: (data: any, progress: number) => void;
  isSubmitting: boolean;
  submissionAction?: "draft" | "submit" | null;
}

export function ProductForm({
  initialData,
  onSaveDraft,
  onSubmitForApproval,
  onFormChange,
  isSubmitting,
  submissionAction,
}: ProductFormProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [variants, setVariants] = useState<any[]>(initialData?.variants || []);
  const [formProgress, setFormProgress] = useState({
    general: 0,
    pricing: 0,
    variants: 0,
    details: 0,
    seo: 0,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [helpSheetOpen, setHelpSheetOpen] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const previousValuesRef = useRef<string>("");
  const variantChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const formUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (variantChangeTimeoutRef.current) {
        clearTimeout(variantChangeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Calculate initial progress based on initialData if it exists
    if (initialData) {
      const initialProgress = {
        general: calculateGeneralProgress(initialData),
        pricing: calculatePricingProgress(initialData),
        variants: calculateVariantsProgress(initialData.variants || []),
        details: calculateDetailsProgress(initialData),
        seo: calculateSeoProgress(initialData),
      };

      setFormProgress(initialProgress);

      // Notify parent of initial progress if onFormChange is provided
      if (onFormChange) {
        const overallProgress = calculateOverallProgress();
        onFormChange(initialData, Math.round(overallProgress));
      }
    }
    // Run this effect only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize form with default values or provided data
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData
      ? {
        name: initialData.name || "",
        description: initialData.description || "",
        category: initialData.category?._id || initialData.category || "",
        gender: initialData.gender || "unisex",
        mode: initialData.mode || "available",
        variants: initialData.variants || [],
        basePrice: {
          currency: initialData.basePrice?.currency || "NGN",
          value: initialData.basePrice?.value || "",
        },
        collectionId: initialData.collectionId || "",
        seo: {
          title: initialData.seo?.title || "",
          description: initialData.seo?.description || "",
          keywords: initialData.seo?.keywords || "",
        },
        shipping: {
          weight: initialData.shipping?.weight || "",
          dimensions: {
            length: initialData.shipping?.dimensions?.length || "",
            width: initialData.shipping?.dimensions?.width || "",
            height: initialData.shipping?.dimensions?.height || "",
          },
        },
      }
      : {
        name: "",
        description: "",
        category: "",
        gender: "unisex",
        mode: "available",
        basePrice: {
          currency: "NGN",
          value: "",
        },
        collectionId: "",
        variants: [],
        seo: {
          title: "",
          description: "",
          keywords: "",
        },
        shipping: {
          weight: "",
          dimensions: {
            length: "",
            width: "",
            height: "",
          },
        },
      },
  });

  const updateVariants = useCallback(
    (newVariants: any[]) => {
      setVariants(newVariants);

      // Update variant progress
      setFormProgress((prev) => ({
        ...prev,
        variants: calculateVariantsProgress(newVariants),
      }));

      // Mark form as updated (for UI feedback)
      setLastUpdateTime(Date.now());

      // Notify parent after a delay to reduce calls
      if (onFormChange) {
        // Clear any existing timeout
        if (variantChangeTimeoutRef.current) {
          clearTimeout(variantChangeTimeoutRef.current);
        }

        variantChangeTimeoutRef.current = setTimeout(() => {
          const formData = {
            ...form.getValues(),
            variants: newVariants,
            _id: initialData?._id,
          };

          onFormChange(formData, calculateOverallProgress());
        }, 1000);
      }
    },
    //eslint-disable-next-line
    [form, onFormChange]
  );

  // Helper function to calculate overall progress
  const calculateOverallProgress = () => {
    const weights = {
      general: 0.3,
      pricing: 0.1,
      variants: 0.4,
      details: 0.1,
      seo: 0.1,
    };

    let progress = 0;
    const currentProgress = formProgress; // Get current state to ensure it's up to date

    for (const [key, weight] of Object.entries(weights)) {
      progress +=
        currentProgress[key as keyof typeof currentProgress] *
        (weight as number);
    }

    return Math.round(progress);
  };

  useEffect(() => {
    // Create our own subscription to form changes with a higher latency
    const subscription = form.watch((value, { name, type }) => {
      // Clear any existing timeout
      if (formUpdateTimeoutRef.current) {
        clearTimeout(formUpdateTimeoutRef.current);
      }

      // Delay processing changes to reduce frequency
      formUpdateTimeoutRef.current = setTimeout(() => {
        // Get the full form data
        const formData = form.getValues();
        const currentValues = JSON.stringify({ ...formData, variants });

        // Only process if values actually changed
        if (currentValues !== previousValuesRef.current) {
          previousValuesRef.current = currentValues;

          // Update the progress calculations
          const newProgress = {
            general: calculateGeneralProgress(formData),
            pricing: calculatePricingProgress(formData),
            variants: calculateVariantsProgress(variants),
            details: calculateDetailsProgress(formData),
            seo: calculateSeoProgress(formData),
          };

          // Only update if the progress has changed
          if (JSON.stringify(newProgress) !== JSON.stringify(formProgress)) {
            setFormProgress(newProgress);
          }

          // Notify parent of changes, but only if onFormChange is provided
          if (onFormChange) {
            const completeData = {
              ...formData,
              variants,
              _id: initialData._id,
            };

            // Use existing overall progress calculation
            const overallProgress = calculateOverallProgress();

            onFormChange(completeData, Math.round(overallProgress));
          }
        }
      }, 1500); // Increased delay to reduce update frequency and improve performance
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
      if (formUpdateTimeoutRef.current) {
        clearTimeout(formUpdateTimeoutRef.current);
      }
    };
    // Importantly, this effect has no dependencies - it only runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants]);

  const calculateGeneralProgress = (formData: any) => {
    const generalFields = ["name", "description", "category", "gender"];
    const generalFilledFields = generalFields.filter((field) => {
      const value = formData[field];
      if (field === "category") {
        // Handle category which could be an object with _id
        return (
          value &&
          (typeof value === "string"
            ? value.trim() !== ""
            : value._id && value._id.trim() !== "")
        );
      }
      return value && (typeof value === "string" ? value.trim() !== "" : true);
    }).length;
    return Math.round((generalFilledFields / generalFields.length) * 100);
  };

  const calculateVariantsProgress = (variants: any[]) => {
    if (!variants || variants.length === 0) return 0;

    const hasSizes = variants.some((v) => v.sizes && v.sizes.length > 0);
    const hasImages = variants.some((v) => v.gallery && v.gallery.length > 0);

    // If at least one variant has an image, and at least one variant has sizes
    if (hasSizes && hasImages) return 100;

    // If only sizes are present, or only images are present (for at least one variant)
    if (hasSizes || hasImages) return 50;

    // If variants exist but neither sizes nor images are present
    return 25;
  };

  const calculatePricingProgress = (formData: any) => {
    return formData.basePrice?.value ? 100 : 0;
  };

  const calculateDetailsProgress = (formData: any) => {
    console.log("fbdjs", formData);
    return formData.collectionId ? 50 : 0;
  };

  const calculateSeoProgress = (formData: any) => {
    const seoFields = ["title", "description", "keywords"];
    const seoFilledFields = seoFields.filter(
      (field) => formData.seo && formData.seo[field]
    ).length;
    return Math.round((seoFilledFields / seoFields.length) * 100);
  };

  // Handle form submission
  const onSubmit = (formData: ProductFormValues) => {
    let updatedVariants = [...variants];

    // Find the first variant with an image
    const variantWithImage = updatedVariants.find(
      (variant) => variant.gallery && variant.gallery.length > 0
    );

    if (variantWithImage) {
      // If a variant with an image is found, populate other variants without images
      updatedVariants = updatedVariants.map((variant) => {
        if (!variant.gallery || variant.gallery.length === 0) {
          return {
            ...variant,
            gallery: variantWithImage.gallery,
          };
        }
        return variant;
      });
    }

    // Combine form data with updated variants
    const completeData = {
      ...formData,
      variants: updatedVariants,
    };

    onSubmitForApproval(completeData);
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    const formData = form.getValues();
    const completeData = {
      ...formData,
      variants,
    };

    onSaveDraft(completeData);
  };

  const overallProgress = calculateOverallProgress();

  // Menu item component for consistent styling
  const MenuItem = ({
    id,
    label,
    icon: Icon,
    progress,
    active,
    onClick,
  }: {
    id: string;
    label: string;
    icon: any;
    progress: number;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 text-left transition-colors ${active ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
        }`}
    >
      <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
      <span className="flex-1">{label}</span>

      <div className="ml-2 flex items-center">
        <div className="w-8 h-1 bg-gray-200 rounded-full">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </button>
  );

  // Render the active tab content based on the activeTab state
  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <Card>
            <CardHeader className="p-6">
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Basic information about your product
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Classic Cotton T-Shirt"
                        className={
                          form.formState.errors.name ? "border-red-500" : ""
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive name that customers can easily
                      understand
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product in detail..."
                        rows={5}
                        className={
                          form.formState.errors.description
                            ? "border-red-500"
                            : ""
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include fabric information, fit details, and care
                      instructions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <CategorySelect
                        value={field.value}
                        onChange={(value, category) => {
                          field.onChange(value);
                        }}
                      />
                      <FormDescription>
                        Choose the most appropriate category for your product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="men">Men</SelectItem>
                          <SelectItem value="women">Women</SelectItem>
                          <SelectItem value="unisex">Unisex</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the intended audience for this product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Mode</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="on-sale">On sale</SelectItem>
                        <SelectItem value="pre-order">Pre-Order</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Available: Available immediately.
                      On sale: Available on a discount
                      Pre-Order: Will be available later
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        );

      case "pricing":
        return (
          <Card>
            <CardHeader className="p-6">
              <CardTitle>Pricing Information</CardTitle>
              <CardDescription>
                Set base price and pricing options
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <FormLabel htmlFor="basePrice">Base Price</FormLabel>
                <div className="flex">
                  <FormField
                    control={form.control}
                    name="basePrice.currency"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-28 rounded-r-none">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NGN">NGN</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="basePrice.value"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <PriceInput
                            id="price"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            placeholder="0.00"
                            className="rounded-l-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormDescription>
                  This is the default price. You can set different prices for
                  specific variants later.
                </FormDescription>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border mt-4">
                <h4 className="font-medium flex items-center">
                  <Info className="h-4 w-4 mr-2 text-blue-500" />
                  Pricing Tips
                </h4>
                <ul className="mt-2 space-y-2 text-sm">
                  <li>
                    • Consider your production costs and desired profit margin
                  </li>
                  <li>• Research comparable products in the market</li>
                  <li>• Premium products should have premium pricing</li>
                  <li>
                    • Remember that customers associate price with quality
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case "variants":
        return (
          <Card>
            <CardHeader className="p-6">
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>
                Add different sizes, colors, and images for your product
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading variant manager...</span>
                  </div>
                }
              >
                <VariantManager
                  onChange={updateVariants}
                  initialVariants={variants}
                  productCode={initialData?.code || "PROD"}
                />
              </Suspense>
            </CardContent>
          </Card>
        );

      case "details":
        return (
          <Card>
            <CardHeader className="p-6">
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Collections, shipping information, and more
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-6">
              <div>
                <FormLabel className="mb-2 block">Collection</FormLabel>
                <CollectionSelect
                  value={form.getValues("collectionId") || ""}
                  onChange={(value) => {
                    form.setValue("collectionId", value);
                    form.trigger("collectionId");
                  }}
                />
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Shipping Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shipping.weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.5"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Dimensions (cm)</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      <FormField
                        control={form.control}
                        name="shipping.dimensions.length"
                        render={({ field }) => (
                          <FormControl>
                            <Input placeholder="Length" {...field} />
                          </FormControl>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping.dimensions.width"
                        render={({ field }) => (
                          <FormControl>
                            <Input placeholder="Width" {...field} />
                          </FormControl>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping.dimensions.height"
                        render={({ field }) => (
                          <FormControl>
                            <Input placeholder="Height" {...field} />
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <ListFilter className="h-4 w-4 mr-2" />
                  Complete the Look
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Suggest other products that pair well with this item
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  Add Related Product
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "seo":
        return (
          <Card>
            <CardHeader className="p-6">
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your product for search engines
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-4">
              <FormField
                control={form.control}
                name="seo.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Premium Cotton T-Shirt - Luxury Brand"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      If left blank, the product name will be used
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seo.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description for search results..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Recommended length: 120-160 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seo.keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. cotton, t-shirt, premium, luxury"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Separate keywords with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-4 bg-gray-50 rounded-lg border mt-4">
                <h4 className="font-medium flex items-center">
                  <Info className="h-4 w-4 mr-2 text-blue-500" />
                  SEO Best Practices
                </h4>
                <ul className="mt-2 space-y-2 text-sm">
                  <li>
                    • Use descriptive titles with important keywords first
                  </li>
                  <li>
                    • Include product details, materials, and benefits in your
                    description
                  </li>
                  <li>
                    • Choose relevant, specific keywords people might search for
                  </li>
                  <li>• Avoid keyword stuffing which can hurt your rankings</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  // Mobile navigation tabs (simplified)
  const renderMobileNavTabs = () => (
    <div className="border-b sticky top-0 bg-white z-10 shadow-sm mb-4">
      <div className="overflow-x-auto flex">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-4 py-3 flex-1 text-center border-b-2 ${activeTab === "general" ? "border-primary" : "border-transparent"
            }`}
        >
          General
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pricing")}
          className={`px-4 py-3 flex-1 text-center border-b-2 ${activeTab === "pricing" ? "border-primary" : "border-transparent"
            }`}
        >
          Pricing
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("variants")}
          className={`px-4 py-3 flex-1 text-center border-b-2 ${activeTab === "variants" ? "border-primary" : "border-transparent"
            }`}
        >
          Variants
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("details")}
          className={`px-4 py-3 flex-1 text-center border-b-2 ${activeTab === "details" ? "border-primary" : "border-transparent"
            }`}
        >
          Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`px-4 py-3 flex-1 text-center border-b-2 ${activeTab === "seo" ? "border-primary" : "border-transparent"
            }`}
        >
          SEO
        </button>
      </div>
    </div>
  );

  // Help/Tips Sheet for mobile
  const renderHelpSheet = () => (
    <Sheet open={helpSheetOpen} onOpenChange={setHelpSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Product Help</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-medium mb-2">Progress</h3>
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm mt-1">{overallProgress}% Complete</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Submission Tips</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                <p>Complete all sections for faster approval</p>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                <p>Products without variants cannot be submitted</p>
              </li>
              <li className="flex items-start">
                <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                <p>Add at least 3 high-quality images per variant</p>
              </li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium">Product Help</h3>
            <div className="text-sm space-y-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:underline"
              >
                <Book className="h-4 w-4 mr-2" />
                Product Creation Guide
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:underline"
              >
                <PanelLeft className="h-4 w-4 mr-2" />
                Product Approval Process
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:underline"
              >
                <Info className="h-4 w-4 mr-2" />
                Image Quality Requirements
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Mobile responsive header with progress */}
        {isMobile && (
          <div className="sticky top-0 bg-white z-20 px-4 py-3 border-b mb-4 flex justify-between items-center">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">
                  {overallProgress}% Complete
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setHelpSheetOpen(true)}
                  className="p-0 h-6"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop sidebar - hidden on mobile */}
          {!isMobile && (
            <div className="w-full lg:w-64 space-y-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">
                    Product Setup Progress
                  </CardTitle>
                  <CardDescription>{overallProgress}% Complete</CardDescription>

                  <div className="h-2 bg-gray-200 rounded-full mt-2">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${overallProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <nav>
                    <ul className="space-y-1">
                      <li>
                        <MenuItem
                          id="general"
                          label="General"
                          icon={Package2}
                          progress={formProgress.general}
                          active={activeTab === "general"}
                          onClick={() => setActiveTab("general")}
                        />
                      </li>
                      <li>
                        <MenuItem
                          id="pricing"
                          label="Pricing"
                          icon={DollarSign}
                          progress={formProgress.pricing}
                          active={activeTab === "pricing"}
                          onClick={() => setActiveTab("pricing")}
                        />
                      </li>
                      <li>
                        <MenuItem
                          id="variants"
                          label="Variants"
                          icon={Tag}
                          progress={formProgress.variants}
                          active={activeTab === "variants"}
                          onClick={() => setActiveTab("variants")}
                        />
                      </li>
                      <li>
                        <MenuItem
                          id="details"
                          label="Details"
                          icon={ScrollText}
                          progress={formProgress.details}
                          active={activeTab === "details"}
                          onClick={() => setActiveTab("details")}
                        />
                      </li>
                      <li>
                        <MenuItem
                          id="seo"
                          label="SEO"
                          icon={Settings}
                          progress={formProgress.seo}
                          active={activeTab === "seo"}
                          onClick={() => setActiveTab("seo")}
                        />
                      </li>
                    </ul>
                  </nav>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Submission Tips</CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                      <p>Complete all sections for faster approval</p>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                      <p>Products without variants cannot be submitted</p>
                    </li>
                    <li className="flex items-start">
                      <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                      <p>Add at least 3 high-quality images per variant</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Product Help</CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-0 text-sm space-y-3">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <Book className="h-4 w-4 mr-2" />
                    Product Creation Guide
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>

                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <PanelLeft className="h-4 w-4 mr-2" />
                    Product Approval Process
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>

                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Image Quality Requirements
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex-1">
            {/* Mobile tabs navigation */}
            {isMobile && renderMobileNavTabs()}

            {/* Render active tab content */}
            {renderTabContent()}

            {/* Mobile-optimized bottom action bar */}
            <div
              className={`
              ${isMobile
                  ? "fixed bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-white border-t shadow-sm z-30"
                  : "mt-6"
                }
              ${isMobile && "flex flex-col gap-2"}
            `}
            >
              {/* Alert area */}
              <div className={isMobile ? "mt-0" : "mb-4"}>
                {overallProgress < 80 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800 flex items-start">
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>
                        Complete at least 80% of product information before
                        submitting
                      </p>
                      <div className="flex flex-wrap gap-x-2 mt-1">
                        {form.formState.errors.name && (
                          <span className="text-xs">
                            • Required: Product Name
                          </span>
                        )}
                        {form.formState.errors.description && (
                          <span className="text-xs">
                            • Required: Description
                          </span>
                        )}
                        {form.formState.errors.category && (
                          <span className="text-xs">• Required: Category</span>
                        )}
                        {form.formState.errors.basePrice?.value && (
                          <span className="text-xs">• Required: Price</span>
                        )}
                        {variants.length === 0 && (
                          <span className="text-xs">
                            • Required: At least one variant
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {overallProgress >= 80 && variants.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600 flex-shrink-0" />
                    <p>Add at least one variant before submitting</p>
                  </div>
                )}

                {overallProgress >= 80 && variants.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
                    <p>Product is ready to be submitted for approval</p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div
                className={`${isMobile ? "flex flex-wrap" : "flex justify-end"
                  } gap-3`}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  className={isMobile ? "flex-1" : ""}
                >
                  {isSubmitting && submissionAction === "draft" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save as Draft
                    </>
                  )}
                </Button>

                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    variants.length === 0 ||
                    overallProgress < 80 ||
                    Object.keys(form.formState.errors).length > 0
                  }
                  className={isMobile ? "flex-1" : ""}
                >
                  {isSubmitting && submissionAction === "submit" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit for Approval
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Spacer for mobile to ensure content is not hidden behind fixed buttons */}
            {isMobile && <div className="h-32"></div>}
          </div>
        </div>
      </form>

      {/* Help sheet for mobile */}
      {renderHelpSheet()}
    </Form>
  );
}
