// providers/theme-provider.tsx
"use client";

import { createContext, useContext } from "react";

interface Theme {
  template: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  logo: string;
  name: string;
  id: string;
}

interface ThemeContextType {
  storeTheme: Theme;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  theme: Theme;
}> = ({ children, theme }) => {
  return (
    <ThemeContext.Provider value={{ storeTheme: theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
