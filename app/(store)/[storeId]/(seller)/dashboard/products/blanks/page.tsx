// /app/(store)/[storeId]/dashboard/products/blanks/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  ChevronRight,
  Filter,
  Loader2,
  Package,
  Search,
  ShoppingCart,
  Tag,
  Truck,
  Grid3X3,
  List,
  X,
} from "lucide-react";

import { Product, useProductStore } from "@/store/product-store";
import { blankService } from "@/lib/api/blank";
import Image from "next/image";
import { BlanksPageSkeleton } from "@/components/skeletons/blanks-skeleton";

// Define interfaces based on your API response
interface Blank {
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
    }[];
    sizes: {
      name: string;
      code: string;
      displayName: string;
      status: string;
    }[];
  }[];
  tags: string[];
  business?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface PaginationMetadata {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse {
  status: string;
  data: {
    results: Product[];
    metadata: PaginationMetadata;
    filters: {
      categories: { _id: string; name: string }[];
      colors: string[];
      sizes: string[];
      genders: string[];
    };
  };
}

export default function BlanksPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams() as { storeId?: string };
  const storeId = params.storeId;
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";
  const { toast } = useToast();

  const { selectBlank, selectedBlanks, unselectBlank } = useProductStore();

  // State for blanks data and loading
  const [blanks, setBlanks] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);
  const [availableFilters, setAvailableFilters] = useState<{
    categories: { _id: string; name: string }[];
    colors: string[];
    sizes: string[];
    genders: string[];
  } | null>(null);

  // State for filters and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [priceMinFilter, setPriceMinFilter] = useState("");
  const [priceMaxFilter, setPriceMaxFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // State for view mode and selections
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSelectionDialog, setShowSelectionDialog] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Load blanks data
  useEffect(() => {
    const loadBlanks = async () => {
      setIsLoading(true);
      try {
        const response = await blankService.getBlanks({
          page: currentPage,
          limit: 20,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          gender: genderFilter !== "all" ? genderFilter : undefined,
          priceMin: priceMinFilter || undefined,
          priceMax: priceMaxFilter || undefined,
          search: searchQuery || undefined,
          color: colorFilter !== "all" ? colorFilter : undefined,
          size: sizeFilter !== "all" ? sizeFilter : undefined,
          sort: sortOption,
        });

        if (response && response.data) {
          const apiResponse = response as unknown as ApiResponse;
          setBlanks(apiResponse.data.results);
          setMetadata(apiResponse.data.metadata);
          setAvailableFilters(apiResponse.data.filters);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (error) {
        console.error("Failed to load blanks:", error);
        toast({
          title: "Error loading blanks",
          description: "Failed to load blanks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBlanks();
  }, [
    searchQuery,
    categoryFilter,
    genderFilter,
    priceMinFilter,
    priceMaxFilter,
    colorFilter,
    sizeFilter,
    sortOption,
    currentPage,
    toast,
  ]);

  // Find the first available image for a blank
  const getBlankImage = (blank: Product) => {
    // Look through all variants to find the first available image
    for (const variant of blank.variants) {
      if (variant.gallery.length > 0 && variant.gallery[0].url) {
        return variant.gallery[0].url;
      }
    }
    return null;
  };

  // Get unique colors from variants with hex values
  const getColorInfo = (variants: Blank["variants"]) => {
    const colorMap = new Map();

    variants.forEach((variant) => {
      if (variant.name && variant.hex) {
        colorMap.set(variant.name, variant.hex);
      } else if (variant.code && variant.hex) {
        colorMap.set(variant.code, variant.hex);
      }
    });

    return Array.from(colorMap).map(([name, hex]) => ({ name, hex }));
  };

  // Handle viewing blank details
  const handleViewBlank = (blankId: string) => {
    router.push(`${base}/dashboard/products/blanks/${blankId}`);
  };

  // Handle continuing with selection
  const handleContinueWithSelection = () => {
    const selectedIds = Object.entries(selectedBlanks)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);

    if (selectedIds.length === 0) {
      toast({
        title: "No blanks selected",
        description: "Please select at least one blank to continue",
        variant: "destructive",
      });
      return;
    }

    // Add selected blanks to store
    selectedIds.forEach((id) => {
      const blank = blanks.find((b) => b._id === id);
      if (blank) {
        selectBlank(blank);
      }
    });

    // Show dialog
    setShowSelectionDialog(true);
  };

  // Navigate to blanks customization page
  const handleGoToCustomization = () => {
    router.push(`${base}/dashboard/products/blanks/customize`);
  };

  // Navigate back to products page
  const handleBack = () => {
    router.push(`${base}/dashboard/products`);
  };

  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || (metadata && page > metadata.totalPages)) return;
    setCurrentPage(page);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setCategoryFilter("all");
    setGenderFilter("all");
    setPriceMinFilter("");
    setPriceMaxFilter("");
    setColorFilter("all");
    setSizeFilter("all");
    setSearchQuery("");
    setSortOption("newest");
    setCurrentPage(1);
  };

  const selectedCount = Object.values(selectedBlanks).filter(Boolean).length;

  // Debounce search input
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  // Filters UI component for different screen sizes
  const FiltersUI = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {availableFilters?.categories.map((category, index) => (
              <SelectItem
                key={`category-${category._id}-${index}`}
                value={category._id}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Gender</label>
        <Select value={genderFilter} onValueChange={setGenderFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Genders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            {availableFilters?.genders.map((gender, index) => (
              <SelectItem key={`gender-${gender}-${index}`} value={gender}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Color</label>
        <Select value={colorFilter} onValueChange={setColorFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Colors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            {availableFilters?.colors.map((color, index) => (
              <SelectItem key={`color-${color}-${index}`} value={color}>
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: getColorHexByName(color) || color,
                    }}
                  />
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Size</label>
        <Select value={sizeFilter} onValueChange={setSizeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Sizes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {availableFilters?.sizes.map((size, index) => (
              <SelectItem key={`size-${size}-${index}`} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="pt-2 space-y-2">
        <label className="text-sm font-medium">Price Range</label>
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Min"
            className="w-1/2"
            value={priceMinFilter}
            onChange={(e) => setPriceMinFilter(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            className="w-1/2"
            value={priceMaxFilter}
            onChange={(e) => setPriceMaxFilter(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  // Helper to get hex color from name if available
  const getColorHexByName = (colorName: string) => {
    // Flatten all variants from all blanks to look for this color
    for (const blank of blanks) {
      for (const variant of blank.variants) {
        if (
          (variant.name &&
            variant.name.toLowerCase() === colorName.toLowerCase()) ||
          (variant.code &&
            variant.code.toLowerCase() === colorName.toLowerCase())
        ) {
          return variant.hex;
        }
      }
    }

    // Common color mappings as fallback
    const colorMap: Record<string, string> = {
      black: "#000000",
      white: "#FFFFFF",
      red: "#FF0000",
      blue: "#0000FF",
      green: "#008000",
      yellow: "#FFFF00",
      purple: "#800080",
      orange: "#FFA500",
      pink: "#FFC0CB",
      gray: "#808080",
      grey: "#808080",
      brown: "#A52A2A",
      navy: "#000080",
    };

    return colorMap[colorName.toLowerCase()];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Browse Blanks</h1>
            <p className="text-muted-foreground">
              Select blanks to customize and sell on your store
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex border rounded-md overflow-hidden shadow-sm">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {selectedCount > 0 && (
            <Button
              onClick={handleContinueWithSelection}
              className="gap-1 bg-blue-600 hover:bg-blue-700"
            >
              <ShoppingCart className="h-4 w-4" />
              Continue ({selectedCount})
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile Filter Button */}
        <div className="md:hidden w-full">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex justify-between items-center"
              >
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </div>
                {(categoryFilter !== "all" ||
                  genderFilter !== "all" ||
                  colorFilter !== "all" ||
                  sizeFilter !== "all" ||
                  priceMinFilter ||
                  priceMaxFilter) && (
                    <Badge className="ml-2 bg-blue-600">Active</Badge>
                  )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader className="pb-4 flex flex-row justify-between items-center">
                <SheetTitle>Filters</SheetTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs h-7 px-2"
                >
                  Reset All
                </Button>
              </SheetHeader>
              <FiltersUI />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop filters */}
        <div className="hidden md:block w-full md:w-72 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs h-7 px-2 hover:bg-gray-100"
                >
                  Reset
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <FiltersUI />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Selection Tips</CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0 text-sm">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="flex-none w-5">•</span>
                  <span>
                    Select blanks that match your target customer preferences
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-none w-5">•</span>
                  <span>Consider fabric quality and material composition</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-none w-5">•</span>
                  <span>Check availability of sizes and colors</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blanks..."
                className="pl-8 shadow-sm"
                defaultValue={searchQuery}
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px] shadow-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <BlanksPageSkeleton />
          ) : blanks.length === 0 ? (
            <div className="text-center py-12 border rounded-lg shadow-sm">
              <Package className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No blanks found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {blanks.map((blank) => {
                    const blankImage = getBlankImage(blank);
                    const colors = getColorInfo(blank.variants);

                    return (
                      <Card
                        key={blank._id}
                        className="overflow-hidden hover:shadow-md transition-shadow shadow-sm border border-gray-200 group"
                      >
                        <div className="p-4 border-b flex justify-between items-center">
                          <CardTitle className="text-lg capitalize truncate">
                            {blank.name}
                          </CardTitle>
                          <Checkbox
                            checked={selectedBlanks.some(
                              (b) => b._id === blank._id
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                selectBlank(blank);
                              } else {
                                unselectBlank(blank._id);
                              }
                            }}
                            className="h-5 w-5"
                          />
                        </div>

                        <div
                          className="aspect-[4/3] relative bg-gray-100 overflow-hidden"
                          onClick={() => handleViewBlank(blank._id)}
                        >
                          {blankImage ? (
                            <Image
                              height={500}
                              width={500}
                              src={blankImage}
                              alt={blank.name}
                              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <Package className="h-12 w-12" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                        </div>

                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {blank.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-50"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {blank.category?.name}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize bg-gray-50"
                            >
                              {blank.gender}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-50"
                            >
                              <Truck className="h-3 w-3 mr-1" />
                              {blank.mode}
                            </Badge>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-blue-700">
                              {new Intl.NumberFormat("en-NG", {
                                style: "currency",
                                currency: blank.basePrice.currency,
                              }).format(Number(blank.basePrice.value))}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {blank.variants.length} variants
                            </p>
                          </div>
                        </CardContent>

                        <CardFooter className="bg-gray-50 p-4 flex flex-col gap-3">
                          <div className="w-full">
                            <span className="text-xs text-muted-foreground block mb-1">
                              Available Colors:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {colors.map((color, idx) => (
                                <div
                                  key={idx}
                                  className="w-6 h-6 rounded-full border border-gray-200"
                                  style={{ backgroundColor: color.hex }}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBlank(blank._id)}
                            className="w-full justify-between hover:bg-blue-50 hover:text-blue-700"
                          >
                            View Details
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="flex flex-col space-y-4">
                  {blanks.map((blank) => {
                    const blankImage = getBlankImage(blank);
                    const colors = getColorInfo(blank.variants);

                    return (
                      <Card
                        key={blank._id}
                        className="overflow-hidden hover:shadow-md transition-shadow shadow-sm border border-gray-200 group"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div
                            className="w-full sm:w-52 md:w-64 h-48 relative bg-gray-100 overflow-hidden cursor-pointer"
                            onClick={() => handleViewBlank(blank._id)}
                          >
                            {blankImage ? (
                              <Image
                                height={500}
                                width={500}
                                src={blankImage}
                                alt={blank.name}
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <Package className="h-12 w-12" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                          </div>

                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-lg font-semibold capitalize">
                                {blank.name}
                              </h3>
                              <Checkbox
                                checked={selectedBlanks.some(
                                  (b) => b._id === blank._id
                                )}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    selectBlank(blank);
                                  } else {
                                    unselectBlank(blank._id);
                                  }
                                }}
                                className="h-5 w-5"
                              />
                            </div>

                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {blank.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-50"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {blank.category?.name}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs capitalize bg-gray-50"
                              >
                                {blank.gender}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-50"
                              >
                                <Truck className="h-3 w-3 mr-1" />
                                {blank.mode}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                              <div>
                                <span className="text-xs text-muted-foreground block">
                                  Price:
                                </span>
                                <p className="font-semibold text-blue-700">
                                  {new Intl.NumberFormat("en-NG", {
                                    style: "currency",
                                    currency: blank.basePrice.currency,
                                  }).format(
                                    Number(blank.basePrice.value)
                                  )}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground block">
                                  Variants:
                                </span>
                                <p>{blank.variants.length}</p>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground block">
                                  Colors:
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {colors.map((color, idx) => (
                                    <div
                                      key={idx}
                                      className="w-5 h-5 rounded-full border border-gray-200"
                                      style={{ backgroundColor: color.hex }}
                                      title={color.name}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground block">
                                  Code:
                                </span>
                                <p>{blank.code}</p>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewBlank(blank._id)}
                                className="gap-1 hover:bg-blue-50 hover:text-blue-700"
                              >
                                View Details
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {metadata && metadata.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="shadow-sm"
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, metadata.totalPages) },
                        (_, i) => {
                          // Show pages around current page
                          let pageToShow;
                          if (metadata.totalPages <= 5) {
                            pageToShow = i + 1;
                          } else if (currentPage <= 3) {
                            pageToShow = i + 1;
                          } else if (currentPage >= metadata.totalPages - 2) {
                            pageToShow = metadata.totalPages - 4 + i;
                          } else {
                            pageToShow = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={i}
                              variant={
                                currentPage === pageToShow
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className={`w-9 h-9 p-0 shadow-sm ${currentPage === pageToShow
                                ? "bg-blue-600 hover:bg-blue-700"
                                : ""
                                }`}
                              onClick={() => handlePageChange(pageToShow)}
                            >
                              {pageToShow}
                            </Button>
                          );
                        }
                      )}
                      {metadata.totalPages > 5 &&
                        currentPage < metadata.totalPages - 2 && (
                          <>
                            <span className="mx-1">...</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-9 h-9 p-0 shadow-sm"
                              onClick={() =>
                                handlePageChange(metadata.totalPages)
                              }
                            >
                              {metadata.totalPages}
                            </Button>
                          </>
                        )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === metadata.totalPages}
                      className="shadow-sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dialog for after selection */}
      <Dialog open={showSelectionDialog} onOpenChange={setShowSelectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Blanks Selected</DialogTitle>
            <DialogDescription>
              {selectedCount} {selectedCount === 1 ? "blank" : "blanks"}{" "}
              selected for customization
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-md bg-blue-50 p-4 border border-blue-100">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <ShoppingCart className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Ready to Customize
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      You&apos;ve selected {selectedCount}{" "}
                      {selectedCount === 1 ? "blank" : "blanks"} to customize.
                      On the next screen, you&apos;ll be able to:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      <li>Select which variants to use</li>
                      <li>Adjust pricing for each variant</li>
                      <li>Add your own images and descriptions</li>
                      <li>Preview how they&apos;ll look in your store</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSelectionDialog(false)}
            >
              Continue Browsing
            </Button>
            <Button
              onClick={handleGoToCustomization}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go to Customization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
