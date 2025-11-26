// Calculate relative luminance
const getLuminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const hexToRGB = (hex: string) => {
  if (typeof hex !== "string") {
    return { r: 0, b: 0, g: 0 };
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

export const getContrastColor = (bgColor: string) => {
  const { r, g, b } = hexToRGB(bgColor);
  const luminance = getLuminance(r, g, b);
  return luminance > 0.5 ? "#000000" : "#ffffff";
};
