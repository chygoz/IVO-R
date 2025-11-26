/**
 * Calculates the best contrasting text color (black or white) for a given hex background color.
 * @param hex - The background hex color (e.g. "#ffffff", "#000", or "abc").
 * @returns The contrasting text color: "#000000" or "#ffffff".
 */
export function getContrastingTextColor(hex: string): string {
  // Normalize hex
  let cleanHex = (hex ? hex : "").replace("#", "");

  // Expand shorthand form (e.g. "03F") to full form ("0033FF")
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  // YIQ equation to determine brightness
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white text depending on brightness
  return yiq >= 128 ? "#000000" : "#ffffff";
}
