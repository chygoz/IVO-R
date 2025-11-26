export const sizes = [
  { label: "Size 20", value: "20" },
  { label: "Size 18", value: "18" },
  { label: "Size 16", value: "16" },
  { label: "Size 14", value: "14" },
  { label: "Size 12", value: "12" },
  { label: "Size 10", value: "10" },
  { label: "Size 8", value: "8" },
];

export const sizesFormatted = [
  { displayName: "Size 20", name: "20", sortOrder: 7, code: "20" },
  { displayName: "Size 18", name: "18", sortOrder: 6, code: "18" },
  { displayName: "Size 16", name: "16", sortOrder: 5, code: "16" },
  { displayName: "Size 14", name: "14", sortOrder: 4, code: "14" },
  { displayName: "Size 12", name: "12", sortOrder: 3, code: "12" },
  { displayName: "Size 10", name: "10", sortOrder: 2, code: "10" },
  { displayName: "Size 8", name: "8", sortOrder: 1, code: "8" },
];

export function getSizeFormatted(value: string) {
  return (
    sizesFormatted.find((v) => v.name === value) || {
      displayName: "",
      name: value,
      sortOrder: 1,
      code: value,
    }
  );
}