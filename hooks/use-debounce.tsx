import { useState, useEffect } from "react";

/**
 * A custom hook that delays updating a value until a specified delay has passed.
 * This is useful for reducing API calls during rapid user input like typing in a search field.
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds before updating the debounced value
 * @returns The debounced value
 *
 * @example
 * const searchQuery = useDebounce(inputValue, 300);
 *
 * useEffect(() => {
 *   // This effect will only run 300ms after the user stops typing
 *   if (searchQuery) {
 *     fetchSearchResults(searchQuery);
 *   }
 * }, [searchQuery]);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if the value changes or the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
