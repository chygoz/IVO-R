import { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useProductStore } from "@/store/product-store";
import { transformProducts } from "@/lib/customization";
import { apiClient } from "@/lib/api/api-client";
import { submissionApi } from "@/lib/api/submissions";
import { blankService } from "@/lib/api/blank";

export const useBlankCustomization = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams() as { storeId?: string };
  const storeId = params.storeId;
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";
  const { toast } = useToast();
  const { user } = useAuth();
  const { selectedBlanks, unselectBlank } = useProductStore();
  const [isLoading, setIsLoading] = useState(true);
  const [customizedBlanks, setCustomizedBlanks] = useState<any[]>([]);
  const [currentBlankIndex, setCurrentBlankIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("details");
  const [isShowingSuccess, setIsShowingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [isViewingImages, setIsViewingImages] = useState(false);

  const getVendorPercentage = () => {
    if (!user?.subscription?.planName) return 10;

    const planName = user.subscription.planName.toUpperCase();
    if (planName.includes("BEN")) return 6;
    if (planName.includes("PRO")) return 6;
    if (planName.includes("BASIC")) return 10;

    return 10;
  };
  const getRates = async (): Promise<{ minimum: number, maximum: number }> => {
    try {
      const rates = await apiClient.get("/blanks/rates")
      return { minimum: rates.minimum || 10, maximum: rates.maximum || 15 }
    } catch (e) {
      return { minimum: 10, maximum: 15 }
    }
  }
  const vendorPercentage = getVendorPercentage();

  const calculateRecommendedPrice = (basePrice: string | number, rates: { minimum: number, maximum: number }) => {
    const price = typeof basePrice === "string" ? parseFloat(basePrice) : basePrice;
    const minimumIncrease = price * (rates.minimum / 100);
    const recommendedPrice = price + minimumIncrease;
    const maximumIncrease = price * (rates.maximum / 100);
    const maximumPrice = price + maximumIncrease;
    return { price: Math.round(recommendedPrice).toString(), maximumPrice: Math.round(maximumPrice).toString() };
  };

  useEffect(() => {
    (async () => {
      if (selectedBlanks.length > 0) {
        const rates = await getRates()
        const initializedBlanks = selectedBlanks.map((blank) => {
          const price = calculateRecommendedPrice(blank.basePrice.value, rates)
          return ({
            ...blank,
            customization: {
              name: blank.name,
              description: blank.description,
              basePrice: {
                currency: blank.basePrice.currency,
                value: price.price,
                maximum: price.maximumPrice,
                minimum: price.price,
                rates: rates
              },
              selectedVariants: [],
              seo: {
                title: "",
                description: "",
                keywords: "",
              },
            },
          })
        });
        console.log(selectedBlanks, initializedBlanks, "blanks")
        setCustomizedBlanks(initializedBlanks);
      }
    })()
    setIsLoading(false);
    //eslint-disable-next-line
  }, [selectedBlanks, vendorPercentage]);

  const handleCustomizationChange = (field: string, value: any) => {
    setCustomizedBlanks((blanks) =>
      blanks.map((blank, index) => {
        if (index === currentBlankIndex) {
          return {
            ...blank,
            customization: {
              ...blank.customization,
              [field]: value,
            },
          };
        }
        return blank;
      })
    );
  };

  const handleNestedFieldChange = (
    parent: string,
    field: string,
    value: any
  ) => {
    setCustomizedBlanks((blanks) =>
      blanks.map((blank, index) => {
        if (index === currentBlankIndex) {
          return {
            ...blank,
            customization: {
              ...blank.customization,
              [parent]: {
                ...blank.customization[parent],
                [field]: value,
              },
            },
          };
        }
        return blank;
      })
    );
  };

  const handleRemoveBlank = (index: number) => {
    setCustomizedBlanks((blanks) => blanks.filter((_, i) => i !== index));
    unselectBlank(selectedBlanks[index]._id);

    if (currentBlankIndex >= index && currentBlankIndex > 0) {
      setCurrentBlankIndex(currentBlankIndex - 1);
    }

    toast({
      title: "Blank removed",
      description: "The blank has been removed from your selection",
    });
  };

  const canSubmit = () => {
    if (customizedBlanks.length === 0) return false;

    for (const blank of customizedBlanks) {
      const customization = blank.customization;

      if (!customization.name || !customization.description) return false;
      if (!customization.basePrice.value) return false;

      const hasSelectedVariant = customization.selectedVariants.some(
        (v: any) => v.selected
      );
      if (!hasSelectedVariant) return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      console.log(customizedBlanks)
      const payload = transformProducts(customizedBlanks);
      const response = await blankService.submitCustomizedBlanks(payload)

      if (response.data) {
        const submissionData = {
          type: "blank",
          category: "add",
          items: response.data.created.map((cr: any) => cr.id),
          name: "Blank Submission",
          message: "Products submitted for approval",
        };
        const result = await submissionApi.createSubmission(submissionData);

        if (result) {
          setIsShowingSuccess(true);
        }
      }
    } catch (error: any) {
      console.log("Failed to submit customized blanks:", error);
      toast({
        title: "Error submitting blanks",
        description: error?.message || "Failed to submit your customized blanks",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMoreBlanks = () => {
    router.push(`${base}/dashboard/products/blanks`);
  };

  const handleViewSubmission = () => {
    router.push(`${base}/dashboard/products/submissions`);
  };

  const handleGoToProducts = () => {
    router.push(`${base}/dashboard/products`);
  };

  return {
    router,
    toast,
    user,
    selectedBlanks,
    unselectBlank,
    isLoading,
    customizedBlanks,
    setCustomizedBlanks,
    currentBlankIndex,
    setCurrentBlankIndex,
    activeTab,
    setActiveTab,
    isShowingSuccess,
    setIsShowingSuccess,
    isSubmitting,
    setIsSubmitting,
    selectedImages,
    setSelectedImages,
    isViewingImages,
    setIsViewingImages,
    vendorPercentage,
    canSubmit,
    handleSubmit,
    handleAddMoreBlanks,
    handleViewSubmission,
    handleGoToProducts,
    handleRemoveBlank,
    handleCustomizationChange,
    handleNestedFieldChange,
  };
};
