"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

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
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Save,
  Send,
  HelpCircle,
  X,
} from "lucide-react";

import { useProductStore } from "@/store/product-store";
import { syncProductToAPI } from "@/lib/api/product-sync";
import { ProductForm } from "../../create/components/product-form";
import { submissionApi } from "@/lib/api/submissions";
import { useFormSync } from "@/hooks/use-form-sync";
import { useApiClient } from "@/lib/api/use-api-client";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const base = `/${(pathname.split("/")[1] || "").trim()}`;
  const apiClient = useApiClient();
  const productId = params.productId as string;
  const { toast } = useToast();

  const { drafts, updateDraft } = useProductStore();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submissionAction, setSubmissionAction] = useState<
    "draft" | "submit" | null
  >(null);
  const [isMobile, setIsMobile] = useState(false);

  const {
    handleFormChange,
    formHasChanges,
    setFormHasChanges,
    apiSyncStatus,
    setApiSyncStatus,
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

  // Load the product - first from API, then fallback to drafts
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!productId) return;

      setIsLoading(true);

      try {
        // First try to fetch from API
        try {
          const apiResponse = await apiClient.seller.get(
            `/api/v1/products/${productId}`
          );

          if (apiResponse?.data && isMounted) {
            // Only update store if product is different to avoid loops
            const currentDraft = drafts.find((d) => d._id === productId);
            const isDifferent =
              !currentDraft ||
              JSON.stringify(currentDraft) !== JSON.stringify(apiResponse.data);

            if (isDifferent) {
              updateDraft(productId, apiResponse.data);
            }

            setProduct(apiResponse.data);
            setIsLoading(false);
            return;
          }
        } catch (apiError) {
          console.log("Product not found in API or error fetching:", apiError);
        }

        // Check in drafts as fallback
        if (isMounted) {
          const draftProduct = drafts.find((d) => d._id === productId);

          if (draftProduct) {
            setProduct(draftProduct);
          } else if (isMounted) {
            // Not found in API or drafts
            toast({
              title: "Product not found",
              description: "The requested product could not be found",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to load product:", error);
          toast({
            title: "Error loading product",
            description: "Failed to load product details",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Save product as draft
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

  // Submit product for approval
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

  // Navigate back
  const handleBack = () => {
    if (formHasChanges) {
      setShowExitConfirm(true);
    } else {
      router.push(`${base}/dashboard/products/${productId}`);
    }
  };

  // Continue editing
  const handleContinueEditing = () => {
    setShowSuccessDialog(false);
  };

  // View product
  const handleViewProduct = () => {
    router.push(`${base}/dashboard/products/${productId}`);
  };

  // View submissions
  const handleViewSubmission = () => {
    router.push(`${base}/dashboard/products/submissions`);
  };

  return (
    <div className="max-w-7xl mx-auto md:px-4 px-0 sm:px-6 pb-20">
      {/* Mobile Header */}
      {isMobile ? (
        <div className="sticky top-0 z-30 bg-white border-b mb-2 py-2">
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
              <h1 className="text-lg font-semibold truncate">
                Edit {product?.name || "Product"}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 px-2">
            <p className="text-sm text-muted-foreground">
              Make changes to your product details
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
                Edit {product?.name || "Product"}
              </h1>
              <p className="text-muted-foreground">
                Make changes to your product details
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

      {/* Product Info Card - with responsive layout */}
      <div
        className={`mb-6 bg-white rounded-md p-4 border ${
          isMobile ? "flex flex-col" : ""
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
              <h2 className="font-semibold">Edit Product</h2>
              <p className="text-sm text-muted-foreground">
                Product ID: {productId.substring(0, 8)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 border rounded-lg bg-white">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
          <p className="mt-2">Loading product data...</p>
        </div>
      ) : product ? (
        <ProductForm
          initialData={product}
          onSaveDraft={handleSaveDraft}
          onSubmitForApproval={handleSubmitForApproval}
          onFormChange={onFormChange}
          isSubmitting={isSubmitting}
          submissionAction={submissionAction}
        />
      ) : (
        <div className="text-center py-12 border rounded-lg bg-white">
          <p className="text-muted-foreground">Product not found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push(`${base}/dashboard/products`)}
            type="button"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
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
            onClick={() => router.push(`${base}/dashboard/products/${productId}`)}
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
                ? "Changes Saved"
                : "Changes Submitted"}
            </DialogTitle>
            <DialogDescription>
              {submissionAction === "draft"
                ? "Your product changes have been saved successfully."
                : "Your product changes have been submitted for approval. You will be notified once they have been reviewed."}
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
                      : "Changes submitted successfully"}
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      {submissionAction === "draft"
                        ? "You can continue editing your product or return to it later."
                        : "Your changes have been added to the submission queue and will be reviewed by our team."}
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
                : "sm:flex-row sm:justify-between sm:space-x-2"
            }
          >
            {submissionAction === "draft" ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleViewProduct}
                  type="button"
                  className={isMobile ? "w-full" : ""}
                >
                  View Product
                </Button>
                <Button
                  onClick={handleContinueEditing}
                  type="button"
                  className={isMobile ? "w-full" : ""}
                >
                  Continue Editing
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleViewProduct}
                  type="button"
                  className={isMobile ? "w-full" : ""}
                >
                  View Product
                </Button>
                <Button
                  onClick={handleViewSubmission}
                  type="button"
                  className={isMobile ? "w-full" : ""}
                >
                  View Submission
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
