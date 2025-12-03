"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Save,
  Send,
  X,
} from "lucide-react";

import { useProductStore } from "@/store/product-store";
import { syncProductToAPI } from "@/lib/api/product-sync";
import { ProductForm } from "./components/product-form";
import { apiClient } from "@/lib/api/api-client";
import { useFormSync } from "@/hooks/use-form-sync";
import { submissionApi } from "@/lib/api/submissions";

export default function CreateProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams() as { storeId?: string };
  const storeId = params.storeId;
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";
  const draftId = searchParams.get("draftId");
  const { toast } = useToast();

  const { drafts, createEmptyDraft, updateDraft } = useProductStore();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionAction, setSubmissionAction] = useState<
    "draft" | "submit" | null
  >(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const {
    handleFormChange,
    formHasChanges,
    setFormHasChanges,
    apiSyncStatus,
    setApiSyncStatus,
    formProgress,
    syncToAPI,
  } = useFormSync(product?._id || "", product);

  const onFormChange = useCallback(
    (data: any, progress: number) => {
      handleFormChange(data, progress);
    },
    [handleFormChange]
  );

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Load the product data - first from API, then fallback to drafts
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!draftId && isMounted) {
        // No draftId - create a new one
        const newDraftId = createEmptyDraft();
        const newDraft = drafts.find((d) => d._id === newDraftId);
        if (isMounted) {
          setProduct(newDraft || null);
          setIsLoading(false);
          // Update URL to reflect the new draft ID
          router.replace(`${base}/dashboard/products/create?draftId=${newDraftId}`);
        }
        return;
      }

      setIsLoading(true);

      try {
        // First try to fetch from API (for existing products)
        try {
          const apiResponse = await apiClient.seller.get(
            `/api/v1/products/${draftId}`
          );

          if (apiResponse?.data && isMounted) {
            // Update draft in store (only if different to avoid loops)
            const currentDraft = drafts.find((d) => d._id === draftId);
            const isDifferent =
              !currentDraft ||
              JSON.stringify(currentDraft) !== JSON.stringify(apiResponse.data);

            if (isDifferent) {
              updateDraft(draftId || "", apiResponse.data);
            }

            setProduct(apiResponse.data);
            setIsLoading(false);
            return;
          }
        } catch (apiError) {
          console.log("Product not found in API or error fetching:", apiError);
        }

        // Check drafts as fallback if API fetch fails
        if (isMounted) {
          const draftProduct = drafts.find((d) => d._id === draftId);

          if (draftProduct) {
            setProduct(draftProduct);
            setIsLoading(false);
            return;
          }

          // If product not found in API or drafts, create a new one with this ID
          const newDraft = {
            _id: draftId,
            name: "",
            code: `P${Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0")}`,
            status: "draft",
            mode: "available",
            slug: "",
            description: "",
            gender: "unisex",
            category: {
              _id: "",
              name: "",
            },
            basePrice: {
              currency: "NGN",
              value: "",
            },
            variants: [],
            tags: [],
            createdAt: new Date().toISOString(),
          };

          //@ts-expect-error
          updateDraft(draftId || "", newDraft);
          if (isMounted) {
            setProduct(newDraft);
            setIsLoading(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error loading product:", error);
          toast({
            title: "Error",
            description: "Failed to load or create product draft",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  // Function to handle saving as draft
  const handleSaveDraft = async (formData: any) => {
    if (!product?._id) return;

    setIsSubmitting(true);
    try {
      const result = await syncProductToAPI(product._id, formData);

      if (result) {
        toast({
          title: "Draft saved",
          description: "Your product draft has been updated",
        });
        setFormHasChanges(false);
      } else {
        toast({
          title: "Warning",
          description: "Draft saved locally but failed to sync to server",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
      toast({
        title: "Error saving draft",
        description: "Failed to save your product draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle submitting for approval
  const handleSubmitForApproval = async (formData: any) => {
    if (!product?._id) return;

    setIsSubmitting(true);
    setSubmissionAction("submit");

    try {
      // Update the draft with the latest form data
      updateDraft(product._id, formData);

      // Ensure data is synced to API
      const syncSuccess = await syncToAPI(formData);

      if (!syncSuccess) {
        toast({
          title: "Sync error",
          description: "Unable to sync product to server. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const submissionData = {
        type: "product",
        category: "add",
        items: [product._id],
        name: new Date().toISOString(),
        message: "Products submitted for approval",
      };

      // Use the submission API
      const result = await submissionApi.createSubmission(submissionData);

      if (result && result.data) {
        toast({
          title: "Products submitted for approval",
          description: `${1} product has been submitted for approval.`,
        });
      }

      setFormHasChanges(false);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Failed to submit product:", error);
      toast({
        title: "Error submitting product",
        description: "Failed to submit your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate back to products page
  const handleBack = () => {
    if (formHasChanges) {
      setShowExitConfirm(true);
    } else {
      router.push(`${base}/dashboard/products`);
    }
  };

  // Continue editing after save/submit
  const handleContinueEditing = () => {
    setShowSuccessDialog(false);
  };

  // View all products
  const handleViewAllProducts = () => {
    router.push(`${base}/dashboard/products`);
  };

  // View submission
  const handleViewSubmission = () => {
    router.push(`${base}/dashboard/products/submissions`);
  };

  // Create another product
  const handleCreateAnother = () => {
    // Create a new draft and navigate to it
    const newDraftId = createEmptyDraft();
    router.push(`${base}/dashboard/products/create?draftId=${newDraftId}`);
    setShowSuccessDialog(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-0 md:px-4 sm:px-6 pb-20">
      {/* Mobile Header */}
      {isMobile ? (
        <div className="sticky top-0 z-10 bg-white border-b mb-2 py-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-1 mr-2"
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1 truncate">
              <h1 className="text-lg font-semibold truncate capitalize">
                {product?.name || "Create New Product"}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 px-2">
            <p className="text-sm text-muted-foreground">
              {product?.name
                ? "Make changes to your product details"
                : "Fill in the details to create a new product"}
            </p>

            <div className="flex items-center text-sm text-muted-foreground ml-2">
              {apiSyncStatus === "syncing" ? (
                <span className="flex items-center">
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  <span className="text-xs">Syncing...</span>
                </span>
              ) : apiSyncStatus === "error" ? (
                <span className="flex items-center text-red-600">
                  <X className="h-3 w-3 mr-1" />
                  <span className="text-xs">Sync failed</span>
                </span>
              ) : formHasChanges ? (
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-xs">Unsaved</span>
                </span>
              ) : (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span className="text-xs">Saved</span>
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Header */
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mr-4"
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {product?.name || "Create New Product"}
              </h1>
              <p className="text-muted-foreground">
                {product?.name
                  ? "Edit your product details"
                  : "Fill in the details to create a new product"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {apiSyncStatus === "syncing" ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                Syncing to server...
              </span>
            ) : apiSyncStatus === "error" ? (
              <span className="flex items-center text-red-600">
                <X className="h-4 w-4 mr-1" />
                Sync failed
              </span>
            ) : formHasChanges ? (
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Unsaved changes
              </span>
            ) : (
              <span className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                All changes saved
              </span>
            )}
          </div>
        </div>
      )}

      {/* Product Info Card - also show on mobile */}
      <div
        className={`mb-6 bg-white rounded-md p-4 border ${isMobile ? "flex flex-col" : ""
          }`}
      >
        <div
          className={
            isMobile
              ? "flex items-center mb-2"
              : "flex items-center justify-between"
          }
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="font-semibold">
                {isMobile ? "Edit Product" : "Product Draft"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isMobile ? "Product ID:" : "ID:"}{" "}
                {product?._id?.substring(0, 8) || "New Draft"}
              </p>
            </div>
          </div>
        </div>

        {isMobile && (
          <div className="mt-2">
            <div className="bg-gray-100 h-2 w-full rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${formProgress}%` }}
              />
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-sm font-medium">
                {formProgress}% Complete
              </span>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 border rounded-lg bg-white">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
          <p className="mt-2">Loading product data...</p>
        </div>
      ) : (
        <ProductForm
          initialData={product}
          onSaveDraft={handleSaveDraft}
          onSubmitForApproval={handleSubmitForApproval}
          onFormChange={onFormChange}
          isSubmitting={isSubmitting}
          submissionAction={submissionAction}
        />
      )}

      {/* Exit confirmation dialog */}
      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you leave this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push(`${base}/dashboard/products`)}
              className="bg-red-500 hover:bg-red-600"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              {submissionAction === "draft"
                ? "Draft Saved"
                : "Product Submitted"}
            </DialogTitle>
            <DialogDescription>
              {submissionAction === "draft"
                ? "Your product draft has been saved successfully."
                : "Your product has been submitted for approval. You will be notified once it has been reviewed."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-md bg-green-50 p-4 border border-green-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    {submissionAction === "draft"
                      ? "Draft saved successfully"
                      : "Submission created successfully"}
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      {submissionAction === "draft"
                        ? "You can continue editing your product or return to it later from your drafts."
                        : "Your product has been added to the submission queue and will be reviewed by our team."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter
            className={
              isMobile
                ? "flex-col space-y-2"
                : "sm:justify-between sm:space-x-2"
            }
          >
            {submissionAction === "draft" ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleViewAllProducts}
                  type="button"
                  className={isMobile ? "w-full" : ""}
                >
                  View All Products
                </Button>
                <div
                  className={
                    isMobile
                      ? "flex flex-col space-y-2 w-full"
                      : "flex flex-row space-x-2"
                  }
                >
                  <Button
                    variant="outline"
                    onClick={handleContinueEditing}
                    type="button"
                    className={isMobile ? "w-full" : ""}
                  >
                    Continue Editing
                  </Button>
                  <Button
                    onClick={handleCreateAnother}
                    type="button"
                    className={isMobile ? "w-full" : ""}
                  >
                    Create Another Product
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleViewAllProducts}
                  type="button"
                  className={isMobile ? "w-full" : ""}
                >
                  View All Products
                </Button>
                <div
                  className={
                    isMobile
                      ? "flex flex-col space-y-2 w-full"
                      : "flex flex-row space-x-2"
                  }
                >
                  <Button
                    variant="outline"
                    onClick={handleCreateAnother}
                    type="button"
                    className={isMobile ? "w-full" : ""}
                  >
                    Create Another Product
                  </Button>
                  <Button
                    onClick={handleViewSubmission}
                    type="button"
                    className={isMobile ? "w-full" : ""}
                  >
                    View Submission
                  </Button>
                </div>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
