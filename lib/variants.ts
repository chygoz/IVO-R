import { Color, Size, Variant } from "@/actions/types";

/**
 * Returns array of unique gallery URLs for a specific color hex
 */
export function findGalleryByColorHex(
  variants: Variant[],
  hex: string
): string[] {
  // Find all variants for this color
  const colorVariants = variants.filter(
    (variant) => variant.color.hex.toLowerCase() === hex.toLowerCase()
  );

  // Get all gallery URLs from these variants
  const uniqueUrls = new Set<string>();

  colorVariants.forEach((variant) => {
    variant.gallery.forEach((item) => {
      uniqueUrls.add(item.url);
    });
  });

  return Array.from(uniqueUrls);
}

/**
 * Returns array of unique gallery URLs for a specific color hex with specific view/type filters
 */
export function findGalleryByColorHexFiltered(
  variants: Variant[],
  hex: string,
  options?: {
    view?: "front" | "side" | "back";
    type?: "full" | "half" | "close-up";
    mode?: "model" | "product";
  }
): string[] {
  const colorVariants = variants.filter(
    (variant) => variant.color.hex.toLowerCase() === hex.toLowerCase()
  );

  const uniqueUrls = new Set<string>();

  colorVariants.forEach((variant) => {
    variant.gallery
      .filter((item) => {
        if (options?.view && item.view !== options.view) return false;
        if (options?.type && item.type !== options.type) return false;
        if (options?.mode && item.mode !== options.mode) return false;
        return true;
      })
      .forEach((item) => {
        uniqueUrls.add(item.url);
      });
  });

  return Array.from(uniqueUrls);
}

/**
 * Returns all variants that match the given color hex code
 */
export function findVariantsByColorHex(
  variants: Variant[],
  hex: string
): Variant[] {
  return variants.filter(
    (variant) => variant.color.hex.toLowerCase() === hex.toLowerCase()
  );
}

/**
 * Returns the Color object that matches the given hex code from any variant
 * Returns undefined if no matching color is found
 */
export function findColorByHex(
  variants: Variant[],
  hex: string
): Color | undefined {
  const variant = variants.find(
    (variant) => variant.color.hex.toLowerCase() === hex.toLowerCase()
  );
  return variant?.color;
}

/**
 * Get all unique colors from variants
 * Useful for building color swatches or filters
 */
export function getAllUniqueColors(variants: Variant[]): Color[] {
  const uniqueColors = new Map<string, Color>();

  variants?.forEach((variant) => {
    if (!uniqueColors.has(variant.color.hex)) {
      uniqueColors.set(variant.color.hex, variant.color);
    }
  });

  return Array.from(uniqueColors.values());
}

/**
 * Check if a specific color hex exists in any variant
 */
export function hasColorHex(variants: Variant[], hex: string): boolean {
  return variants.some(
    (variant) => variant.color.hex.toLowerCase() === hex.toLowerCase()
  );
}

/**
 * Returns the Size object that matches the given size code from any variant
 * Returns undefined if no matching size is found
 */
export function findSizeByCode(
  variants: Variant[],
  sizeCode: string
): Size | undefined {
  const variant = variants.find(
    (variant) => variant.size.code.toLowerCase() === sizeCode.toLowerCase()
  );
  return variant?.size;
}

/**
 * Get all unique sizes from variants, sorted by sortOrder
 * Useful for building size selectors
 */
export function getAllUniqueSizes(variants: Variant[]): Size[] {
  const uniqueSizes = new Map<string, Size>();

  variants.forEach((variant) => {
    if (!uniqueSizes.has(variant.size.code)) {
      uniqueSizes.set(variant.size.code, variant.size);
    }
  });

  return Array.from(uniqueSizes.values()).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

/**
 * Get all available sizes for a specific color hex
 * Returns sorted array of Size objects
 * Optionally filter by stock status
 */
export function findSizesByColorHex(
  variants: Variant[],
  hex: string,
  inStockOnly: boolean = false
): Size[] {
  const colorVariants = variants?.filter((variant) => {
    const colorMatch = variant.color.hex.toLowerCase() === hex.toLowerCase();
    return inStockOnly
      ? colorMatch && variant.status === "in-stock"
      : colorMatch;
  });

  const uniqueSizes = new Map<string, Size>();

  colorVariants?.forEach((variant) => {
    if (!uniqueSizes.has(variant.size.code)) {
      uniqueSizes.set(variant.size.code, variant.size);
    }
  });

  return Array.from(uniqueSizes.values()).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

/**
 * Find a specific variant by color hex and size code
 * Returns undefined if no matching variant is found
 */
export function findVariantByColorAndSize(
  variants: Variant[],
  hex: string,
  sizeCode: string
): Variant | undefined {
  return variants.find(
    (variant) =>
      variant.color.hex.toLowerCase() === hex.toLowerCase() &&
      variant.size.code.toLowerCase() === sizeCode.toLowerCase()
  );
}

/**
 * Find a specific variant by color hex and size code with additional filters
 * Returns undefined if no matching variant is found
 */
export function findVariantByColorAndSizeFiltered(
  variants: Variant[],
  hex: string,
  sizeCode: string,
  options?: {
    activeOnly?: boolean;
    inStockOnly?: boolean;
  }
): Variant | undefined {
  return variants?.find((variant) => {
    const colorMatch = variant.color.hex.toLowerCase() === hex.toLowerCase();
    const sizeMatch =
      variant.size.code.toLowerCase() === sizeCode.toLowerCase();
    const activeMatch = options?.activeOnly ? variant.active : true;
    const stockMatch = options?.inStockOnly
      ? variant.status === "in-stock"
      : true;

    return colorMatch && sizeMatch && activeMatch && stockMatch;
  });
}
