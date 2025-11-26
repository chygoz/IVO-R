"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Loader2,
  Pencil,
  Settings,
  Tag,
} from "lucide-react";

import { useProductStore } from "@/store/product-store";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { transformProducts } from "@/lib/customization";
import { apiClient } from "@/lib/api/api-client";
import { submissionApi } from "@/lib/api/submissions";
import { BlankCustomizePageSkeleton } from "@/components/blanks/BlankCustomizePageSkeleton";
import { EmptyState } from "@/components/blanks/EmptyState";
import { SuccessDialog } from "@/components/blanks/SuccessDialog";
import { BlankListSidebar } from "@/components/blanks/BlankListSidebar";
import { CustomizationForms } from "@/components/blanks/CustomizationForms";
import { useBlankCustomization } from "./hooks/useBlankCustomization";

export default function BlankCustomizePage() {
  const {
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
  } = useBlankCustomization();
  if (isLoading) {
    return <BlankCustomizePageSkeleton />;
  }

  if (customizedBlanks.length === 0) {
    return <EmptyState handleAddMoreBlanks={handleAddMoreBlanks} />;
  }

  const currentBlank = customizedBlanks[currentBlankIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddMoreBlanks}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Customize Blanks
            </h1>
            <p className="text-muted-foreground">
              Customize {customizedBlanks.length}{" "}
              {customizedBlanks.length === 1 ? "blank" : "blanks"} before
              submission
            </p>
          </div>
        </div>

        {/* Show subscription info */}
        <div className="text-right">
          <Badge variant="outline" className="mb-2">
            {user?.subscription?.planName || "Basic"} Plan
          </Badge>
          <p className="text-sm text-muted-foreground">
            Vendor commission: {vendorPercentage}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <BlankListSidebar
          customizedBlanks={customizedBlanks}
          currentBlankIndex={currentBlankIndex}
          setCurrentBlankIndex={setCurrentBlankIndex}
          handleRemoveBlank={handleRemoveBlank}
          handleAddMoreBlanks={handleAddMoreBlanks}
        />

        <div className="md:col-span-3">
          {currentBlank && (
            <motion.div
              key={currentBlankIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Tabs
                defaultValue="details"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <Card className="shadow-sm">
                  <CardHeader className="p-6 pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle>{currentBlank.name}</CardTitle>
                      <Badge variant="outline">
                        {customizedBlanks.indexOf(currentBlank) + 1} of{" "}
                        {customizedBlanks.length}
                      </Badge>
                    </div>

                    <div className="mt-4">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="details" className="gap-1">
                          <Pencil className="h-4 w-4" />
                          Details
                        </TabsTrigger>
                        <TabsTrigger value="pricing" className="gap-1">
                          <DollarSign className="h-4 w-4" />
                          Pricing
                        </TabsTrigger>
                        <TabsTrigger value="variants" className="gap-1">
                          <Tag className="h-4 w-4" />
                          Variants
                        </TabsTrigger>
                        <TabsTrigger value="seo" className="gap-1">
                          <Settings className="h-4 w-4" />
                          SEO
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <CustomizationForms
                      currentBlank={currentBlank}
                      handleCustomizationChange={handleCustomizationChange}
                      handleNestedFieldChange={handleNestedFieldChange}
                      vendorPercentage={vendorPercentage}
                      setSelectedImages={setSelectedImages}
                      setIsViewingImages={setIsViewingImages}
                      setCustomizedBlanks={setCustomizedBlanks}
                      currentBlankIndex={currentBlankIndex}
                      toast={toast}
                    />
                  </CardContent>

                  <CardFooter className="p-6 border-t flex flex-col gap-2">
                    <div className="w-full">
                      {canSubmit() && (
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700 sm:hidden flex w-full"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Submit All Blanks
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    <div className="flex w-full justify-between">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (currentBlankIndex > 0) {
                            setCurrentBlankIndex(currentBlankIndex - 1);
                          }
                        }}
                        disabled={currentBlankIndex === 0}
                      >
                        Previous Blank
                      </Button>

                      <div className="flex gap-3">
                        {canSubmit() && (
                          <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 hidden sm:flex"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Submit All Blanks
                              </>
                            )}
                          </Button>
                        )}

                        <Button
                          onClick={() => {
                            if (
                              currentBlankIndex <
                              customizedBlanks.length - 1
                            ) {
                              setCurrentBlankIndex(currentBlankIndex + 1);
                            }
                          }}
                          disabled={
                            currentBlankIndex === customizedBlanks.length - 1
                          }
                          variant={canSubmit() ? "outline" : "default"}
                        >
                          Next Blank
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Tabs>
            </motion.div>
          )}
        </div>
      </div>

      <SuccessDialog
        isShowingSuccess={isShowingSuccess}
        setIsShowingSuccess={setIsShowingSuccess}
        customizedBlanks={customizedBlanks}
        handleGoToProducts={handleGoToProducts}
        handleViewSubmission={handleViewSubmission}
      />

      {/* Image Preview Dialog */}
      <Dialog open={isViewingImages} onOpenChange={setIsViewingImages}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Images</DialogTitle>
            <DialogDescription>Images for this color variant</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    width={1000}
                    height={1000}
                    src={image.url}
                    alt={`Product view ${index + 1}`}
                    className="w-full rounded-md border border-gray-200"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {index + 1} of {selectedImages.length}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsViewingImages(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}