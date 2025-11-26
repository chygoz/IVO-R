import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type PriceRange = {
  min: number;
  max: number;
};

type SortOption = {
  sort: string;
  order: string;
};

type FilterOptions = {
  query: string;
  category: string;
  gender: string;
  group: string;
  colors: string[];
  sizes: string[];
  priceRange: PriceRange;
  mode: string;
  sort: SortOption;
  page: number;
  limit: number;
};

type UseProductFiltersReturn = {
  filters: FilterOptions;
  updateFilters: (partialFilters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  toggleColor: (colorCode: string) => void;
  toggleSize: (sizeCode: string) => void;
  updatePriceRange: (min: number, max: number) => void;
  updateSort: (sort: string, order: string) => void;
  setPage: (page: number) => void;
  hasActiveFilters: () => boolean;
};

const defaultPriceRange = { min: 0, max: 100000 };

/**
 * Custom hook for managing product filters
 */
export const useProductFilters = (
  initialPriceRange: PriceRange = defaultPriceRange
): UseProductFiltersReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filter state from URL params
  const [filters, setFilters] = useState<FilterOptions>({
    query: searchParams.get("query") || "",
    category: searchParams.get("category") || "",
    gender: searchParams.get("gender") || "",
    group: searchParams.get("group") || "",
    colors: searchParams.get("colors")
      ? searchParams.get("colors")!.split(",")
      : [],
    sizes: searchParams.get("sizes")
      ? searchParams.get("sizes")!.split(",")
      : [],
    priceRange: {
      min: parseFloat(
        searchParams.get("minPrice") || initialPriceRange.min.toString()
      ),
      max: parseFloat(
        searchParams.get("maxPrice") || initialPriceRange.max.toString()
      ),
    },
    mode: searchParams.get("mode") || "",
    sort: {
      sort: searchParams.get("sort") || "createdAt",
      order: searchParams.get("order") || "desc",
    },
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "12"),
  });

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.query) params.set("query", filters.query);
    if (filters.category) params.set("category", filters.category);
    if (filters.gender) params.set("gender", filters.gender);
    if (filters.group) params.set("group", filters.group);
    if (filters.mode) params.set("mode", filters.mode);
    if (filters.colors.length > 0)
      params.set("colors", filters.colors.join(","));
    if (filters.sizes.length > 0) params.set("sizes", filters.sizes.join(","));

    // Only add price range if different from default
    if (filters.priceRange.min !== initialPriceRange.min) {
      params.set("minPrice", filters.priceRange.min.toString());
    }
    if (filters.priceRange.max !== initialPriceRange.max) {
      params.set("maxPrice", filters.priceRange.max.toString());
    }

    params.set("sort", filters.sort.sort);
    params.set("order", filters.sort.order);

    // Only add page if not first page
    if (filters.page > 1) {
      params.set("page", filters.page.toString());
    }

    // Update URL without reloading the page
    const url = `/search?${params.toString()}`;
    window.history.pushState({ path: url }, "", url);
  }, [filters, initialPriceRange]);

  // Update filters with partial data
  const updateFilters = useCallback(
    (partialFilters: Partial<FilterOptions>) => {
      setFilters((prev) => ({
        ...prev,
        ...partialFilters,
        // Reset to page 1 when changing filters, unless page is explicitly set
        page: partialFilters.page ?? 1,
      }));
    },
    []
  );

  // Reset all filters to default values
  const resetFilters = useCallback(() => {
    setFilters({
      query: "",
      category: "",
      gender: "",
      group: "",
      colors: [],
      sizes: [],
      priceRange: initialPriceRange,
      mode: "",
      sort: {
        sort: "createdAt",
        order: "desc",
      },
      page: 1,
      limit: 12,
    });
  }, [initialPriceRange]);

  // Toggle color selection
  const toggleColor = useCallback((colorCode: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorCode)
        ? prev.colors.filter((c) => c !== colorCode)
        : [...prev.colors, colorCode],
      page: 1, // Reset to page 1 when changing colors
    }));
  }, []);

  // Toggle size selection
  const toggleSize = useCallback((sizeCode: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(sizeCode)
        ? prev.sizes.filter((s) => s !== sizeCode)
        : [...prev.sizes, sizeCode],
      page: 1, // Reset to page 1 when changing sizes
    }));
  }, []);

  // Update price range
  const updatePriceRange = useCallback((min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { min, max },
      page: 1, // Reset to page 1 when changing price range
    }));
  }, []);

  // Update sort options
  const updateSort = useCallback((sort: string, order: string) => {
    setFilters((prev) => ({
      ...prev,
      sort: { sort, order },
      page: 1, // Reset to page 1 when changing sort
    }));
  }, []);

  // Set current page
  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useCallback(() => {
    return (
      filters.query !== "" ||
      filters.category !== "" ||
      filters.gender !== "" ||
      filters.group !== "" ||
      filters.mode !== "" ||
      filters.colors.length > 0 ||
      filters.sizes.length > 0 ||
      filters.priceRange.min !== initialPriceRange.min ||
      filters.priceRange.max !== initialPriceRange.max ||
      filters.sort.sort !== "createdAt" ||
      filters.sort.order !== "desc"
    );
  }, [filters, initialPriceRange]);

  return {
    filters,
    updateFilters,
    resetFilters,
    toggleColor,
    toggleSize,
    updatePriceRange,
    updateSort,
    setPage,
    hasActiveFilters,
  };
};

export default useProductFilters;
