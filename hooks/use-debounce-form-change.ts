import { useRef, useCallback } from "react";
import debounce from "lodash/debounce";
import { useProductStore } from "@/store/product-store";

export const useDebouncedFormChange = (
  productId: string,
  setFormHasChanges: (value: boolean) => void,
  setFormProgress: (value: number) => void
) => {
  const { updateDraft, markChanges } = useProductStore();
  const debouncedUpdateRef = useRef<any>(null);

  // Initialize the debounced function
  if (!debouncedUpdateRef.current) {
    debouncedUpdateRef.current = debounce((data: any) => {
      if (!productId) return;

      // Update the draft with the latest data
      updateDraft(productId, data);

      // Mark for syncing
      markChanges(productId);

      // We keep formHasChanges true until we get confirmation of a successful sync
    }, 500); // 500ms debounce for form updates
  }

  // Return a memoized callback
  return useCallback(
    (data: any, progress: number) => {
      setFormHasChanges(true);
      debouncedUpdateRef.current(data);

      // Any other UI updates needed
      setFormProgress(progress);
    },
    [productId, setFormHasChanges]
  );
};
