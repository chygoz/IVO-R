import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { apiClient } from "@/lib/api/api-client";

// New Interfaces based on your schema
export interface IPrice {
  currency: string;
  value: string;
}

export interface ProductSize {
  active: boolean;
  name: string;
  code: string;
  status: string;
  displayName: string;
  sortOrder: number;
  sku: string;
  quantity: number;
  pendingQuantity?: number;
}

export interface IGallery {
  _id: string;
  url: string;
  mode?: "model" | "flat" | "closeup";
  type?: "full" | "thumbnail";
  view?: "front" | "back" | "side" | "detail";
  file?: File;
}

export type IProductStockLevel = "out-of-stock" | "in-stock" | "limited-stock";

export interface IVariant {
  _id: string;
  name: string;
  hex: string;
  code: string;
  sizes: ProductSize[];
  status: IProductStockLevel;
  price?: IPrice;
  gallery: IGallery[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  code: string;
  status: "draft" | "pending" | "published" | "archived" | "ready";
  mode: "pre-order" | "on-sale" | "available";
  slug: string;
  description: string;
  gender: "men" | "women" | "unisex";
  category: {
    _id: string;
    name: string;
  };
  basePrice: IPrice;
  variants: IVariant[];
  tags: string[];
  business?: {
    _id: string;
    name: string;
    slug: string;
  };
  seo?: {
    title: string;
    description: string;
    keywords: string;
  };
  shipping?: {
    weight: string;
    dimensions: {
      length: string;
      width: string;
      height: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  isBlank?: boolean;
  sourceBlankId?: string;
  collectionId: string;
}

export interface ProductSubmission {
  _id: string;
  type: "product";
  business: string;
  category: "add" | "update" | "delete";
  items: string[]; // Array of product IDs
  status: "draft" | "pending" | "approved" | "rejected" | "cancelled";
  updates: SubmissionUpdate[];
  initiated: {
    user: string;
    initiatedAt: string;
  };
  name?: string; // Optional submission name for easier identification
}

export interface SubmissionUpdate {
  _id: string;
  message: string;
  from: "admin" | "seller";
  timestamp: string;
  action?: "update" | "approve" | "reject";
}

// Sync manager to track changes and sync with API
interface SyncState {
  lastSynced: string | null;
  pendingChanges: Record<string, boolean>;
  isProcessing: boolean;
}

interface ProductState {
  // Drafts - products in progress not yet submitted
  drafts: Product[];

  // Selected blanks for customization
  selectedBlanks: Product[];

  // Current processing draft
  currentDraft: Product | null;

  // Sync state
  syncState: SyncState;

  // User permissions based on subscription
  userPermissions: {
    canCreateOwnProducts: boolean;
    canSelectBlanks: boolean;
    productLimit: number | null;
    blankSelectionLimit: number | null;
  };

  // Actions
  setUserPermissions: (
    permissions: Partial<ProductState["userPermissions"]>
  ) => void;

  // Draft products management
  createEmptyDraft: (productId?: string, product?: any) => string;
  updateDraft: (draftId: string, data: Partial<Product>) => void;
  deleteDraft: (draftId: string) => void;
  setCurrentDraft: (draftId: string | null) => void;

  // Variant management
  addVariantToDraft: (draftId: string, variant: Partial<IVariant>) => string;
  updateVariantInDraft: (
    draftId: string,
    variantId: string,
    data: Partial<IVariant>
  ) => void;
  deleteVariantFromDraft: (draftId: string, variantId: string) => void;

  // Size management
  addSizeToVariant: (
    draftId: string,
    variantId: string,
    size: Partial<ProductSize>
  ) => void;
  updateSizeInVariant: (
    draftId: string,
    variantId: string,
    sizeCode: string,
    data: Partial<ProductSize>
  ) => void;
  deleteSizeFromVariant: (
    draftId: string,
    variantId: string,
    sizeCode: string
  ) => void;

  // Blanks management
  selectBlank: (blank: Product) => void;
  unselectBlank: (blankId: string) => void;
  customizeBlank: (blankId: string, customization: Partial<Product>) => void;

  // Gallery management
  addImageToVariant: (
    draftId: string,
    variantId: string,
    image: Partial<IGallery>
  ) => void;
  deleteImageFromVariant: (
    draftId: string,
    variantId: string,
    imageId: string
  ) => void;

  // Sync management
  markChanges: (draftId: string) => void;
  syncChanges: () => Promise<void>;
  refreshFromAPI: () => Promise<void>;

  // Reset store
  clearAll: () => void;
}

// Prepare product data for API
export const prepareProductPayload = (product: Product) => {
  // Convert the product data to the format expected by the API
  return {
    _id: product._id,
    name: product.name,
    code: product.code,
    status: product.status,
    mode: product.mode,
    slug: product.slug,
    description: product.description,
    gender: product.gender,
    ...(product.category?._id
      ? { category: product.category._id }
      : product.category
        ? { category: product.category }
        : { category: "" }),
    basePrice: product.basePrice,
    variants: product.variants.map((variant) => ({
      name: variant.name,
      hex: variant.hex,
      code: variant.code,
      status: variant.status,
      active: variant.active,
      // Map the sizes
      sizes: variant.sizes.map((size) => ({
        name: size.name,
        code: size.code,
        displayName: size.displayName,
        sortOrder: size.sortOrder,
        quantity: size.quantity,
        status: size.status,
        active: size.active,
        sku: size.sku,
      })),
      // Only include gallery if there are images
      gallery: variant.gallery.map((image) => ({
        _id: image._id,
        url: image.url,
        mode: image.mode,
        type: image.type,
        view: image.view,
      })),
    })),
    tags: product.tags,
    collectionId: product.collectionId || "",
    // Include SEO and shipping if they exist
    ...(product.seo && { seo: product.seo }),
    ...(product.shipping && { shipping: product.shipping }),
  };
};

// Sync product to API using the new sync endpoint
const syncToAPI = async (
  productId: string,
  productData: any
): Promise<boolean> => {
  try {
    // Make sure we're not making unnecessary API calls
    if (!productData || !productId) {
      console.warn("Invalid product data for sync", { productId, productData });
      return false;
    }

    // Prepare the payload
    const payload = prepareProductPayload(productData);

    // Use the sync endpoint
    const response = await apiClient.seller.put(
      `/api/v1/products/sync`,
      payload
    );

    console.log("Sync response:", response);
    return response && response.success === true;
  } catch (error) {
    console.error("Error syncing product to API:", error);
    return false;
  }
};

// Track sync timeouts to avoid duplication
let syncTimeoutIds: Record<string, NodeJS.Timeout> = {};

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      drafts: [],
      selectedBlanks: [],
      draftSubmissions: [],
      currentDraft: null,

      syncState: {
        lastSynced: null,
        pendingChanges: {},
        isProcessing: false,
      },

      userPermissions: {
        canCreateOwnProducts: true,
        canSelectBlanks: true,
        productLimit: null,
        blankSelectionLimit: null,
      },

      setUserPermissions: (permissions) => {
        set((state) => ({
          userPermissions: {
            ...state.userPermissions,
            ...permissions,
          },
        }));
      },

      createEmptyDraft: (
        productId?: string,
        serverProduct?: Partial<Product>
      ) => {
        const draftId = productId || uuidv4();

        const emptyDraft: Product = {
          _id: draftId,
          name: serverProduct?.name || "",
          code:
            serverProduct?.code ||
            `P${Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0")}`,
          status: "draft",
          mode: "available",
          slug: serverProduct?.slug || "",
          description: serverProduct?.description || "",
          gender: serverProduct?.gender || "unisex",
          category: serverProduct?.category || {
            _id: "",
            name: "",
          },
          basePrice: serverProduct?.basePrice || {
            currency: "NGN",
            value: "",
          },
          variants: serverProduct?.variants || [],
          tags: serverProduct?.tags || [],
          collectionId: serverProduct?.collectionId || "",
          createdAt: serverProduct?.createdAt || new Date(),
          updatedAt: serverProduct?.updatedAt || new Date(),
          seo: serverProduct?.seo || {
            title: "",
            description: "",
            keywords: "",
          },
          shipping: serverProduct?.shipping || {
            weight: "",
            dimensions: {
              length: "",
              width: "",
              height: "",
            },
          },
        };

        set((state) => ({
          drafts: [...state.drafts, emptyDraft],
          currentDraft: emptyDraft,
        }));

        return draftId;
      },

      updateDraft: async (draftId, data: Partial<Product>) => {
        // First, get the current state of the draft
        const state = get();
        const currentDraft = state.drafts.find((d) => d._id === draftId);

        if (!currentDraft) {
          console.error(`Cannot update draft ${draftId}: not found in store`);
          return;
        }

        // Optimistically update the local store
        set((state) => {
          const updatedDrafts = state.drafts.map((draft) =>
            draft._id === draftId ? { ...draft, ...data } : draft
          );

          const updatedCurrentDraft =
            state.currentDraft?._id === draftId
              ? { ...state.currentDraft, ...data }
              : state.currentDraft;

          return {
            drafts: updatedDrafts,
            currentDraft: updatedCurrentDraft,
          };
        });

        // Then update on the API
        try {
          const updatedDraft = { ...currentDraft, ...data };
          const payload = prepareProductPayload(updatedDraft);

          const response = await apiClient.seller.put(
            `/api/v1/products/sync`,
            payload
          );

          console.log("Update response:", response);

          if (!response || !response.success) {
            console.error(`Failed to update product ${draftId} on API`);
            // Could add rollback logic here if needed
          }
        } catch (error) {
          console.error(`Error updating product ${draftId} on API:`, error);
        }
      },

      deleteDraft: (draftId) => {
        // Delete from store first (optimistic update)
        set((state) => ({
          drafts: state.drafts.filter((draft) => draft._id !== draftId),
          currentDraft:
            state.currentDraft?._id === draftId ? null : state.currentDraft,
        }));

        // We don't need to await this as we've already updated the UI
        fetch(`/api/v1/products/${draftId}`, {
          method: "DELETE",
        }).catch((err) => {
          console.error("Error deleting product from API:", err);
        });
      },

      setCurrentDraft: (draftId) => {
        if (!draftId) {
          set({ currentDraft: null });
          return;
        }

        const draft = get().drafts.find((d) => d._id === draftId) || null;
        set({ currentDraft: draft });
      },

      addVariantToDraft: (draftId, variant) => {
        const variantId = variant._id || uuidv4();

        const newVariant: IVariant = {
          _id: variantId,
          name: variant.name || "",
          hex: variant.hex || "#000000",
          code: variant.code || "",
          sizes: variant.sizes || [],
          status: variant.status || "in-stock",
          gallery: variant.gallery || [],
          active: variant.active !== undefined ? variant.active : true,
          price: variant.price,
        };

        set((state) => {
          const updatedDrafts = state.drafts.map((draft) =>
            draft._id === draftId
              ? {
                ...draft,
                variants: [...draft.variants, newVariant],
              }
              : draft
          );

          const updatedCurrentDraft =
            state.currentDraft?._id === draftId
              ? {
                ...state.currentDraft,
                variants: [
                  ...(state.currentDraft?.variants || []),
                  newVariant,
                ],
              }
              : state.currentDraft;

          return {
            drafts: updatedDrafts,
            currentDraft: updatedCurrentDraft,
          };
        });

        // Mark changes for sync
        get().markChanges(draftId);

        return variantId;
      },

      updateVariantInDraft: (draftId, variantId, data) => {
        set((state) => {
          const updatedDrafts = state.drafts.map((draft) =>
            draft._id === draftId
              ? {
                ...draft,
                variants: draft.variants.map((variant) =>
                  variant._id === variantId
                    ? { ...variant, ...data }
                    : variant
                ),
              }
              : draft
          );

          const updatedCurrentDraft =
            state.currentDraft?._id === draftId
              ? {
                ...state.currentDraft,
                variants: state.currentDraft.variants.map((variant) =>
                  variant._id === variantId
                    ? { ...variant, ...data }
                    : variant
                ),
              }
              : state.currentDraft;

          return {
            drafts: updatedDrafts,
            currentDraft: updatedCurrentDraft,
          };
        });

        // Mark changes for sync
        get().markChanges(draftId);
      },

      deleteVariantFromDraft: (draftId, variantId) => {
        set((state) => {
          const updatedDrafts = state.drafts.map((draft) =>
            draft._id === draftId
              ? {
                ...draft,
                variants: draft.variants.filter(
                  (variant) => variant._id !== variantId
                ),
              }
              : draft
          );

          const updatedCurrentDraft =
            state.currentDraft?._id === draftId
              ? {
                ...state.currentDraft,
                variants: state.currentDraft.variants.filter(
                  (variant) => variant._id !== variantId
                ),
              }
              : state.currentDraft;

          return {
            drafts: updatedDrafts,
            currentDraft: updatedCurrentDraft,
          };
        });

        // Mark changes for sync
        get().markChanges(draftId);
      },

      // New method for adding size to a variant
      addSizeToVariant: (draftId, variantId, size) => {
        const newSize: ProductSize = {
          name: size.name || "",
          code: size.code || uuidv4(),
          displayName: size.displayName || "",
          sortOrder: size.sortOrder || 0,
          sku: size.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
          quantity: size.quantity || 0,
          active: size.active !== undefined ? size.active : true,
          status: size.status || "in-stock",
          pendingQuantity: size.pendingQuantity,
        };

        set((state) => {
          const updatedDrafts = state.drafts.map((draft) => {
            if (draft._id !== draftId) return draft;

            return {
              ...draft,
              variants: draft.variants.map((variant) => {
                if (variant._id !== variantId) return variant;

                // Check if this size code already exists
                const sizeExists = variant.sizes.some(
                  (s) => s.code === newSize.code
                );
                if (sizeExists) return variant;

                return {
                  ...variant,
                  sizes: [...variant.sizes, newSize],
                };
              }),
            };
          });

          const updatedCurrentDraft =
            state.currentDraft?._id === draftId
              ? {
                ...state.currentDraft,
                variants: state.currentDraft.variants.map((variant) => {
                  if (variant._id !== variantId) return variant;

                  // Check if this size code already exists
                  const sizeExists = variant.sizes.some(
                    (s) => s.code === newSize.code
                  );
                  if (sizeExists) return variant;

                  return {
                    ...variant,
                    sizes: [...variant.sizes, newSize],
                  };
                }),
              }
              : state.currentDraft;

          return {
            drafts: updatedDrafts,
            currentDraft: updatedCurrentDraft,
          };
        });

        // Mark changes for sync
        get().markChanges(draftId);
      },

      // Update size in variant
      updateSizeInVariant: (draftId, variantId, sizeCode, data) => {
        set((state) => {
          const updatedDrafts = state.drafts.map((draft) => {
            if (draft._id !== draftId) return draft;

            return {
              ...draft,
              variants: draft.variants.map((variant) => {
                if (variant._id !== variantId) return variant;

                return {
                  ...variant,
                  sizes: variant.sizes.map((size) =>
                    size.code === sizeCode ? { ...size, ...data } : size
                  ),
                };
              }),
            };
          });

          const updatedCurrentDraft =
            state.currentDraft?._id === draftId
              ? {
                ...state.currentDraft,
                variants: state.currentDraft.variants.map((variant) => {
                  if (variant._id !== variantId) return variant;

                  return {
                    ...variant,
                    sizes: variant.sizes.map((size) =>
                      size.code === sizeCode ? { ...size, ...data } : size
                    ),
                  };
                }),
              }
              : state.currentDraft;

          return {
            drafts: updatedDrafts,
            currentDraft: updatedCurrentDraft,
          };
        });

        // Mark changes for sync
        get().markChanges(draftId);
      },

      // Delete size from variant
      deleteSizeFromVariant: (draftId, variantId, sizeCode) => {
        set((state) => {
          const updatedDrafts = state.drafts.map((draft) => {
            if (draft._id !== draftId) return draft;

            return {
              ...draft,
              variants: draft.variants.map((variant) => {
                if (variant._id !== variantId) return variant;

                return {
                  ...variant,
                  sizes: variant.sizes.filter((size) => size.code !== sizeCode),
                };
              }),
            };
          });

          const updatedCurrentDraft =
            state.currentDraft?._id === draftId
              ? {
                ...state.currentDraft,
                variants: state.currentDraft.variants.map((variant) => {
                  if (variant._id !== variantId) return variant;

                  return {
                    ...variant,
                    sizes: variant.sizes.filter(
                      (size) => size.code !== sizeCode
                    ),
                  };
                }),
              }
              : state.currentDraft;

          return {
            drafts: updatedDrafts,
            currentDraft: updatedCurrentDraft,
          };
        });

        // Mark changes for sync
        get().markChanges(draftId);
      },

      selectBlank: (blank) => {
        // Check if this blank is already selected
        const isAlreadySelected = get().selectedBlanks.some(
          (b) => b._id === blank._id
        );

        if (isAlreadySelected) return;

        set((state) => ({
          selectedBlanks: [
            ...state.selectedBlanks,
            { ...blank, isBlank: true },
          ],
        }));
      },

      unselectBlank: (blankId) => {
        set((state) => ({
          selectedBlanks: state.selectedBlanks.filter(
            (blank) => blank._id !== blankId
          ),
        }));
      },

      customizeBlank: (blankId, customization) => {
        set((state) => ({
          selectedBlanks: state.selectedBlanks.map((blank) =>
            blank._id === blankId
              ? {
                ...blank,
                ...customization,
                sourceBlankId: blank._id,
                _id: uuidv4(),
              }
              : blank
          ),
        }));
      },

      addImageToVariant: (draftId, variantId, image) => {
        const imageWithId = {
          ...image,
          _id: image._id || uuidv4(),
        };

        set((state: any) => {
          const updatedDrafts = state.drafts.map((draft: any) => {
            if (draft._id !== draftId) return draft;

            return {
              ...draft,
              variants: draft.variants.map((variant: any) => {
                if (variant._id !== variantId) return variant;

                return {
                  ...variant,
                  gallery: [...variant.gallery, imageWithId],
                };
              }),
            };
          });

          const updatedCurrentDraft =
            state.currentDraft?._id === draftId
              ? {
                ...state.currentDraft,
                variants: state.currentDraft.variants.map((variant: any) => {
                  if (variant._id !== variantId) return variant;

                  return {
                    ...variant,
                    gallery: [...variant.gallery, imageWithId],
                  };
                }),
              }
              : state.currentDraft;

          return {
            drafts: updatedDrafts,
            currentDraft: updatedCurrentDraft,
          };
        });

        // Mark changes for sync
        get().markChanges(draftId);
      },

      deleteImageFromVariant: (draftId, variantId, imageId) => {
        set((state) => {
          const updatedDrafts = state.drafts.map((draft) => {
            if (draft._id !== draftId) return draft;

            return {
              ...draft,
              variants: draft.variants.map((variant) => {
                if (variant._id !== variantId) return variant;

                return {
                  ...variant,
                  gallery: variant.gallery.filter((img) => img._id !== imageId),
                };
              }),
            };
          });

          const updatedCurrentDraft =
            state.currentDraft?._id === draftId
              ? {
                ...state.currentDraft,
                variants: state.currentDraft.variants.map((variant) => {
                  if (variant._id !== variantId) return variant;

                  return {
                    ...variant,
                    gallery: variant.gallery.filter(
                      (img) => img._id !== imageId
                    ),
                  };
                }),
              }
              : state.currentDraft;

          return {
            drafts: updatedDrafts,
            currentDraft: updatedCurrentDraft,
          };
        });

        // Mark changes for sync
        get().markChanges(draftId);
      },

      // Mark product as having changes to sync - with improved debouncing
      markChanges: (draftId) => {
        // Get current state
        const currentState = get();

        // Don't do anything if already processing this product
        if (currentState.syncState.isProcessing) {
          return;
        }

        // Update pending changes state
        set((state) => {
          const pendingChanges = { ...state.syncState.pendingChanges };
          pendingChanges[draftId] = true;

          return {
            syncState: {
              ...state.syncState,
              pendingChanges,
            },
          };
        });

        // Clear previous timeout for this productId if it exists
        if (syncTimeoutIds[draftId]) {
          clearTimeout(syncTimeoutIds[draftId]);
          delete syncTimeoutIds[draftId];
        }

        // Schedule a new sync after 30 seconds
        syncTimeoutIds[draftId] = setTimeout(() => {
          const stateAtTimeOfSync = get();

          // Skip if we're already processing or no longer have pending changes
          if (
            stateAtTimeOfSync.syncState.isProcessing ||
            !stateAtTimeOfSync.syncState.pendingChanges[draftId]
          ) {
            return;
          }

          // Find the product
          const productToSync = stateAtTimeOfSync.drafts.find(
            (d) => d._id === draftId
          );

          if (productToSync) {
            // Set processing flag for this sync operation
            set((state) => ({
              syncState: {
                ...state.syncState,
                isProcessing: true,
              },
            }));

            // Perform the sync
            syncToAPI(draftId, productToSync)
              .then((success) => {
                if (success) {
                  // Update sync state - clear pending change for this product
                  set((state) => {
                    const pendingChanges = {
                      ...state.syncState.pendingChanges,
                    };
                    delete pendingChanges[draftId];

                    return {
                      syncState: {
                        ...state.syncState,
                        isProcessing: false,
                        pendingChanges,
                        lastSynced: new Date().toISOString(),
                      },
                    };
                  });

                  console.log(
                    `Product ${draftId} synced successfully at ${new Date().toISOString()}`
                  );
                } else {
                  // Just clear processing flag on failure
                  set((state) => ({
                    syncState: {
                      ...state.syncState,
                      isProcessing: false,
                    },
                  }));
                  console.error(`Failed to sync product ${draftId}`);
                }
              })
              .catch((error) => {
                console.error(`Error syncing product ${draftId}:`, error);
                set((state) => ({
                  syncState: {
                    ...state.syncState,
                    isProcessing: false,
                  },
                }));
              })
              .finally(() => {
                // Clean up the timeout reference
                delete syncTimeoutIds[draftId];
              });
          }
        }, 30000); // 30 seconds delay for sync
      },

      // Sync all pending changes to API
      syncChanges: async () => {
        const state = get();

        // If already processing or no pending changes, return
        if (
          state.syncState.isProcessing ||
          Object.keys(state.syncState.pendingChanges).length === 0
        ) {
          return;
        }

        // Set processing flag
        set((state) => ({
          syncState: {
            ...state.syncState,
            isProcessing: true,
          },
        }));

        try {
          // Get list of product IDs with pending changes
          const pendingIds = Object.keys(state.syncState.pendingChanges).filter(
            (id) => state.syncState.pendingChanges[id] === true
          );

          console.log(
            `Starting sync for ${pendingIds.length} products:`,
            pendingIds
          );

          // Process each pending product
          for (const productId of pendingIds) {
            const product = state.drafts.find((d) => d._id === productId);

            if (product) {
              console.log(`Syncing product ${productId}`);
              const success = await syncToAPI(productId, product);
              console.log(
                `Sync result for ${productId}:`,
                success ? "success" : "failed"
              );
            } else {
              console.warn(
                `Product ${productId} marked for sync but not found in drafts`
              );
            }
          }

          // Update sync state - clear all pending changes and update last synced time
          set((state) => {
            // Clear only the pending changes we successfully processed
            const remainingChanges = { ...state.syncState.pendingChanges };
            pendingIds.forEach((id) => {
              delete remainingChanges[id];
            });

            return {
              syncState: {
                pendingChanges: remainingChanges,
                isProcessing: false,
                lastSynced: new Date().toISOString(),
              },
            };
          });

          console.log(
            "All pending products synced at",
            new Date().toISOString()
          );
        } catch (error) {
          console.error("Error syncing changes to API:", error);

          // Update processing flag only, leaving pending changes intact
          set((state) => ({
            syncState: {
              ...state.syncState,
              isProcessing: false,
            },
          }));
        }
      },
      refreshFromAPI: async () => {
        // This function can be called to refresh the local cache from the API
        try {
          const response = await apiClient.seller.get(
            "/api/v1/products?status=draft&limit=100"
          );

          if (response && response.success && response.data) {
            // Replace the entire drafts array with the API data
            set({ drafts: response.data.results });

            // Also update currentDraft if it exists
            const currentDraftId = get().currentDraft?._id;
            if (currentDraftId) {
              const updatedDraft = response.data.results.find(
                (d: any) => d._id === currentDraftId
              );
              if (updatedDraft) {
                set({ currentDraft: updatedDraft });
              }
            }
          }
        } catch (error) {
          console.error("Error refreshing from API:", error);
        }
      },

      clearAll: () => {
        // Clear all timeouts
        Object.values(syncTimeoutIds).forEach((timeoutId) => {
          clearTimeout(timeoutId);
        });
        syncTimeoutIds = {};

        set({
          drafts: [],
          selectedBlanks: [],
          currentDraft: null,
          syncState: {
            lastSynced: null,
            pendingChanges: {},
            isProcessing: false,
          },
        });
      },
    }),
    {
      name: "product-store",
      storage: createJSONStorage(() => localStorage),
      // Handle rehydration properly
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("Store rehydrated successfully");
        }
      },
    }
  )
);

// Setup a safer interval for auto-sync
if (typeof window !== "undefined") {
  // Use a module-level variable instead of attaching to window
  let autoSyncIntervalId: NodeJS.Timeout | null = null;

  // Clean up previous interval
  if (autoSyncIntervalId) {
    clearInterval(autoSyncIntervalId);
    autoSyncIntervalId = null;
  }

  // Set up a new interval that runs less frequently
  autoSyncIntervalId = setInterval(() => {
    try {
      const productStore = useProductStore.getState();

      // Skip if already processing or no pending changes
      const pendingChanges = Object.keys(productStore.syncState.pendingChanges);
      if (productStore.syncState.isProcessing || pendingChanges.length === 0) {
        return;
      }

      // Only sync if it's been at least 5 minutes since last sync
      const lastSynced = productStore.syncState.lastSynced
        ? new Date(productStore.syncState.lastSynced)
        : new Date(0);

      const now = new Date();
      const timeSinceLastSync = now.getTime() - lastSynced.getTime();
      const fiveMinutesMs = 5 * 60 * 1000;

      if (timeSinceLastSync >= fiveMinutesMs) {
        console.log(
          `Auto-sync triggered for ${pendingChanges.length} pending products`
        );
        productStore.syncChanges();
      }
    } catch (error) {
      console.error("Error in auto-sync interval:", error);
    }
  }, 300000); // Check every 5 minutes instead of 2 minutes
}
