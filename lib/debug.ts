// lib/debug.ts
export const debug = {
  components: process.env.NODE_ENV === "development",
  rendering: process.env.NODE_ENV === "development",
  animations: process.env.NODE_ENV === "development",
  store: process.env.NODE_ENV === "development",

  log: (category: string, ...args: any[]) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEBUG:${category}]`, ...args);
    }
  },
};
