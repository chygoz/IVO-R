export const removeDot = (text: string): string => {
  return text.startsWith(".") ? text.slice(1) : text;
};
