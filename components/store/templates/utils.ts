export type StoreTheme = {
  template: "minimal" | "luxury" | "modern" | "classic" | "bold";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  seo?: any;
  banner?: string;
  logo?: string;
  name: string;
  id: string;
  headline?: string;
  subtext?: string;
};

// Theme templates with descriptions and default colors
export const themeTemplates = [
  {
    id: "luxury",
    name: "Luxury",
    description: "Elegant and sophisticated with gold accents",
    colors: {
      primary: "#8A6D3B",
      secondary: "#F0EAD6",
      accent: "#DFD7BF",
      background: "#FFFFFF",
      text: "#333333",
    },
    preview: "/themes/luxury.png",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Strong and vibrant with high contrast",
    colors: {
      primary: "#E63946",
      secondary: "#1D3557",
      accent: "#457B9D",
      background: "#F1FAEE",
      text: "#1D3557",
    },
    preview: "/themes/bold.png",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Timeless and traditional design",
    colors: {
      primary: "#2C3E50",
      secondary: "#ECF0F1",
      accent: "#3498DB",
      background: "#FFFFFF",
      text: "#2C3E50",
    },
    preview: "/themes/classic.png",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean and minimal with bold accents",
    colors: {
      primary: "#6C63FF",
      secondary: "#F5F5F5",
      accent: "#FF6584",
      background: "#FFFFFF",
      text: "#333333",
    },
    preview: "/themes/modern.png",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Understated with focus on content",
    colors: {
      primary: "#333333",
      secondary: "#FFFFFF",
      accent: "#CCCCCC",
      background: "#F8F8F8",
      text: "#333333",
    },
    preview: "/themes/minimal.png",
  },
];
