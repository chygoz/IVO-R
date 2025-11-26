import { Variant } from "@/actions/types";

export function findView(
  variant: Variant,
  view: "front" | "side" | "back",
  type?: "full" | "half" | "close-up"
) {
  if (!variant) return "";
  const viewFound = variant.gallery.find((g) => {
    return g.view === view && (!type || g.type === type);
  });
  if (!viewFound) {
    if (type) {
      return findView(variant, view);
    }
    return "";
  }
  return viewFound.url;
}

export function findVariantByColor(
  variants: Variant[],
  colorCode: string,
  view: "front" | "side" | "back" = "front",
  type?: "full" | "half" | "close-up"
): string {
  // Find the variant with matching color
  const variant = variants.find((v) => v.color.code === colorCode);

  // If no variant found with that color, return empty string
  if (!variant) {
    return "";
  }

  // Use the existing findView function to get the image URL
  return findView(variant, view, type);
}
