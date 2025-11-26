import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PriceInput } from "@/components/ui/price-input";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Info,
  DollarSign,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";
import PriceWarning from "./priceWarning";

interface CustomizationFormsProps {
  currentBlank: any;
  handleCustomizationChange: (field: string, value: any) => void;
  handleNestedFieldChange: (parent: string, field: string, value: any) => void;
  vendorPercentage: number;
  setSelectedImages: (images: any[]) => void;
  setIsViewingImages: (isOpen: boolean) => void;
  setCustomizedBlanks: (blanks: any) => void;
  currentBlankIndex: number;
  toast: any;
}

export const CustomizationForms = ({
  currentBlank,
  handleCustomizationChange,
  handleNestedFieldChange,
  vendorPercentage,
  setSelectedImages,
  setIsViewingImages,
  setCustomizedBlanks,
  currentBlankIndex,
  toast,
}: CustomizationFormsProps) => {
  const groupedVariants = currentBlank.variants.reduce((acc: { [key: string]: any }, variant: any) => {
    const colorCode = variant?.color?.code;
    if (!acc[colorCode]) {
      acc[colorCode] = {
        code: variant?.color?.code,
        name: variant?.color?.name,
        hex: variant?.color?.hex,
        gallery: variant?.gallery,
        sizes: [],
      };
    }

    acc[colorCode].sizes.push({
      ...variant.size,
      quantity: variant?.quantity,
      status: variant?.status,
      sku: variant?.sku,
      active: variant.active
    });
    let gallery = acc[colorCode].gallery || [];
    gallery = gallery.concat(Array.isArray(variant.gallery) ? variant.gallery : []);
    const uniqueGallery = Array.from(
      new Map(gallery.map((obj: any) => [obj.url, obj])).values()
    );
    acc[colorCode].gallery = uniqueGallery;

    return acc;
  }, {});
  return (
    <>
      <TabsContent value="details" className="mt-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={currentBlank.customization.name || ""}
              onChange={(e) =>
                handleCustomizationChange("name", e.target.value)
              }
              placeholder="Enter a name for your product"
            />
            <p className="text-xs text-muted-foreground">
              Choose a descriptive name that customers will easily understand
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={currentBlank.customization.description || ""}
              onChange={(e) =>
                handleCustomizationChange("description", e.target.value)
              }
              placeholder="Describe your product"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              Include important details like materials, fit, care instructions,
              and features
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Original Blank Information
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p className="font-medium">Name: {currentBlank.name}</p>
                  <p className="mt-1">{currentBlank.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="pricing" className="mt-0">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={currentBlank.customization.basePrice.currency}
                onValueChange={(value) =>
                  handleNestedFieldChange("basePrice", "currency", value)
                }
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN (₦)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basePrice">Your Selling Price</Label>
              <PriceInput
                id="basePrice"
                value={currentBlank.customization.basePrice.value || ""}
                min={currentBlank.customization.basePrice.minimum}
                max={currentBlank.customization.basePrice.maximum}
                onChange={(value) => {
                  return handleNestedFieldChange("basePrice", "value", value)
                }
                }
                placeholder="Enter your selling price"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-medium mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Revenue Breakdown
              </h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span>Default Blank Price:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: currentBlank.basePrice.currency,
                    }).format(Number(currentBlank.basePrice.value))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Your Selling Price:</span>
                  <span className="font-medium text-blue-600">
                    {currentBlank.customization.basePrice.value
                      ? new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency:
                          currentBlank.customization.basePrice.currency,
                      }).format(
                        Number(currentBlank.customization.basePrice.value)
                      )
                      : "Not set"}
                  </span>
                </div>
                <Separator />
                {currentBlank.customization.base_price?.value && (
                  <>
                    {(() => {
                      const sellingPrice = Number(
                        currentBlank.customization.basePrice.value
                      );
                      const vendorCommission =
                        (sellingPrice * vendorPercentage) / 100;
                      const yourRevenue = sellingPrice - vendorCommission;
                      const revenuePercentage =
                        sellingPrice > 0
                          ? (yourRevenue / sellingPrice) * 100
                          : 0;

                      return (
                        <>
                          <div className="flex justify-between items-center">
                            <span>
                              Vendor Commission ({vendorPercentage}%):
                            </span>
                            <span className="font-medium text-red-600">
                              -
                              {new Intl.NumberFormat("en-NG", {
                                style: "currency",
                                currency:
                                  currentBlank.customization.basePrice
                                    .currency,
                              }).format(vendorCommission)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-semibold">Your Revenue:</span>
                            <span
                              className={`font-semibold ${yourRevenue > 0
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                            >
                              {new Intl.NumberFormat("en-NG", {
                                style: "currency",
                                currency:
                                  currentBlank.customization.basePrice
                                    .currency,
                              }).format(yourRevenue)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Revenue Share:</span>
                            <span
                              className={`text-xs font-medium ${revenuePercentage > 0
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                            >
                              {revenuePercentage.toFixed(1)}%
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium mb-2 flex items-center text-blue-800">
                <Info className="h-4 w-4 mr-2" />
                Pricing Options
              </h4>
              <div className="text-sm text-blue-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span>Use Default Price:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleNestedFieldChange(
                        "basePrice",
                        "value",
                        currentBlank.customization.basePrice.minimum
                      );
                    }}
                  >
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: currentBlank.customization.basePrice.currency,
                    }).format(Number(currentBlank.customization.basePrice.minimum))}
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Higher Margin ({currentBlank.customization.basePrice.rates.maximum}%):</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const higherPrice = Math.round(
                        Number(currentBlank.customization.basePrice.maximum)
                      );
                      handleNestedFieldChange(
                        "basePrice",
                        "value",
                        higherPrice.toString()
                      );
                    }}
                  >
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: currentBlank.customization.basePrice.currency,
                    }).format(Number(currentBlank.customization.basePrice.maximum))}
                  </Button>
                </div>
                <p className="text-xs mt-2">
                  You have full control over your selling price.
                  The vendor takes {vendorPercentage}% commission from whatever price you
                  set.
                </p>
              </div>
            </div>
            <PriceWarning
              price={currentBlank.customization.basePrice.value}
              maximumPrice={currentBlank.customization.basePrice.maximum}
              minimumPrice={currentBlank.customization.basePrice.minimum}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="variants" className="mt-0">
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Select which colors and sizes you want to include in your product
            and set their quantities
          </p>

          {Object.values(groupedVariants).map((variant: any, variantIndex: number) => {
            return (
              <motion.div
                key={variant.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: variantIndex * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center">
                    <div
                      className="h-4 w-4 rounded-full mr-2 border border-gray-200"
                      style={{ backgroundColor: variant.hex }}
                    />
                    <span className="capitalize">{variant.name}</span>
                  </h3>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (variant.gallery && variant.gallery.length > 0) {
                        setSelectedImages(variant.gallery);
                        setIsViewingImages(true);
                      } else {
                        toast({
                          title: "No images",
                          description: `No images available for ${variant.name} color`,
                          variant: "destructive",
                        });
                      }
                    }}
                    className="gap-1"
                  >
                    <ImageIcon className="h-4 w-4" />
                    View Images ({variant.gallery?.length || 0})
                  </Button>
                </div>

                {variant.gallery && variant.gallery.length > 0 && (
                  <div className="mb-4">
                    <Image
                      width={100}
                      height={100}
                      src={variant.gallery[0]?.url}
                      alt={`${variant.name} preview`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {variant.sizes?.map((size: any, sizeIndex: number) => {
                      const variantSizeId = `${variant.code}-${size.code}`;
                      const isSelected =
                        currentBlank.customization.selectedVariants.some(
                          (v: any) =>
                            v.variantId === variantSizeId && v.selected
                        );
                      const selectedVariant =
                        currentBlank.customization.selectedVariants.find(
                          (v: any) => v.variantId === variantSizeId
                        );
                      const quantity = selectedVariant?.quantity || 1;

                      return (
                        <motion.div
                          key={size.code}
                          whileHover={{ scale: 1.02 }}
                          className={`border rounded-lg p-4 transition-all ${isSelected
                            ? "bg-white shadow-sm border-blue-200"
                            : "bg-gray-100 opacity-70"
                            }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  setCustomizedBlanks((blanks: any) =>
                                    blanks.map((blank: any, index: number) => {
                                      if (index === currentBlankIndex) {
                                        const existingVariantIndex =
                                          blank.customization.selectedVariants.findIndex(
                                            (v: any) =>
                                              v.variantId === variantSizeId
                                          );

                                        let updatedSelectedVariants;
                                        if (existingVariantIndex >= 0) {
                                          updatedSelectedVariants =
                                            blank.customization.selectedVariants.map(
                                              (v: any, idx: number) =>
                                                idx === existingVariantIndex
                                                  ? {
                                                    ...v,
                                                    selected: checked === true,
                                                  }
                                                  : v
                                            );
                                        } else {
                                          updatedSelectedVariants = [
                                            ...blank.customization
                                              .selectedVariants,
                                            {
                                              variantId: variantSizeId,
                                              selected: checked === true,
                                              quantity: 1,
                                              maxQuantity: size.quantity,
                                              colorCode: variant.code,
                                              colorName: variant.name,
                                              colorHex: variant.hex,
                                              sizeCode: size.code,
                                              sizeName: size.name,
                                              sizeDisplayName: size.displayName,
                                            },
                                          ];
                                        }

                                        return {
                                          ...blank,
                                          customization: {
                                            ...blank.customization,
                                            selectedVariants:
                                              updatedSelectedVariants,
                                          },
                                        };
                                      }
                                      return blank;
                                    })
                                  );
                                }}
                                id={`variant-${variantSizeId}`}
                                className="mr-2"
                              />
                              <Label
                                htmlFor={`variant-${variantSizeId}`}
                                className="font-medium cursor-pointer"
                              >
                                {size.displayName}
                              </Label>
                            </div>
                            <Badge
                              variant={
                                size.active
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {size.active ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </div>

                          <div className="pl-6 space-y-3">
                            <div className="text-sm text-muted-foreground">
                              <div className="flex justify-between mb-1">
                                <span>Color:</span>
                                <span className="capitalize flex items-center">
                                  <div
                                    className="w-3 h-3 rounded-full mr-1 border border-gray-300"
                                    style={{
                                      backgroundColor: variant.hex,
                                    }}
                                  />
                                  {variant.name}
                                </span>
                              </div>
                              <div className="flex justify-between mb-1">
                                <span>Size Code:</span>
                                <span className="font-mono text-xs">
                                  {size.code}
                                </span>
                              </div>
                              <div className="flex justify-between mb-1">
                                <span>Available:</span>
                                <span className="font-medium">
                                  {size.quantity || 0} units
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="capitalize">{size.status}</span>
                              </div>
                            </div>

                            {/* {isSelected && (
                              <div>
                                <Label
                                  htmlFor={`quantity-${variantSizeId}`}
                                  className="text-sm mb-1 block"
                                >
                                  Quantity to Stock
                                </Label>
                                <Input
                                  id={`quantity-${variantSizeId}`}
                                  type="number"
                                  min="1"
                                  max={size.quantity || 0}
                                  value={quantity}
                                  onChange={(e) => {
                                    const value =
                                      parseInt(e.target.value) || 1;
                                    const maxQty = size.quantity || 0;
                                    const constrainedValue = Math.min(
                                      Math.max(value, 1),
                                      maxQty
                                    );

                                    setCustomizedBlanks((blanks: any) =>
                                      blanks.map((blank: any, index: number) => {
                                        if (index === currentBlankIndex) {
                                          return {
                                            ...blank,
                                            customization: {
                                              ...blank.customization,
                                              selectedVariants:
                                                blank.customization.selectedVariants.map(
                                                  (v: any) =>
                                                    v.variantId ===
                                                      variantSizeId
                                                      ? {
                                                        ...v,
                                                        quantity:
                                                          constrainedValue,
                                                      }
                                                      : v
                                                ),
                                            },
                                          };
                                        }
                                        return blank;
                                      })
                                    );
                                  }}
                                  className="text-sm"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Maximum available: {size.quantity || 0} units
                                </p>
                              </div>
                            )}
                            {isSelected &&
                              quantity >= (size.quantity || 0) && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                                  You&apos;ve reached the maximum available
                                  quantity.
                                </div>
                              )} */}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </TabsContent>

      <TabsContent value="seo" className="mt-0">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Optimize your product for search engines to improve visibility
            (optional)
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo-title">SEO Title</Label>
              <Input
                id="seo-title"
                placeholder="Enter SEO title"
                value={currentBlank.customization.seo.title || ""}
                onChange={(e) =>
                  handleNestedFieldChange("seo", "title", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                If left blank, the product name will be used
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo-description">Meta Description</Label>
              <Textarea
                id="seo-description"
                placeholder="Enter meta description"
                rows={3}
                value={currentBlank.customization.seo.description || ""}
                onChange={(e) =>
                  handleNestedFieldChange("seo", "description", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Recommended length: 120-160 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo-keywords">Keywords</Label>
              <Input
                id="seo-keywords"
                placeholder="e.g. t-shirt, cotton, fashion"
                value={currentBlank.customization.seo.keywords || ""}
                onChange={(e) =>
                  handleNestedFieldChange("seo", "keywords", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Separate keywords with commas
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border mt-4">
            <h4 className="font-medium mb-2">SEO Preview</h4>
            <div className="p-3 bg-white border rounded">
              <p className="text-blue-600 text-base font-medium truncate">
                {currentBlank.customization.seo.title ||
                  currentBlank.customization.name ||
                  currentBlank.name}
              </p>
              <p className="text-green-700 text-xs truncate">
                yourstorename.com/products/{currentBlank.slug}
              </p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {currentBlank.customization.seo.description ||
                  currentBlank.customization.description ||
                  currentBlank.description}
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    </>
  );
};