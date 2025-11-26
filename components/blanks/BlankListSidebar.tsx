import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Package, Plus, X, Check } from "lucide-react";

interface BlankListSidebarProps {
  customizedBlanks: any[];
  currentBlankIndex: number;
  setCurrentBlankIndex: (index: number) => void;
  handleRemoveBlank: (index: number) => void;
  handleAddMoreBlanks: () => void;
}

export const BlankListSidebar = ({
  customizedBlanks,
  currentBlankIndex,
  setCurrentBlankIndex,
  handleRemoveBlank,
  handleAddMoreBlanks,
}: BlankListSidebarProps) => {
  const currentBlank = customizedBlanks[currentBlankIndex];

  return (
    <div className="md:col-span-1 space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="p-4">
          <CardTitle className="text-base">Selected Blanks</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y">
            {customizedBlanks.map((blank, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                  currentBlankIndex === index
                    ? "bg-blue-50 border-r-2 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setCurrentBlankIndex(index)}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                    {blank.variants[0]?.gallery?.[0]?.url ? (
                      <Image
                        width={400}
                        height={400}
                        src={blank.variants[0].gallery[0].url}
                        alt={blank.name}
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-gray-400" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium line-clamp-1">
                      {blank.customization.name || blank.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {blank.variants.length} variants
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBlank(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1"
            onClick={handleAddMoreBlanks}
          >
            <Plus className="h-4 w-4" />
            Add More Blanks
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="p-4">
          <CardTitle className="text-base">Customization Progress</CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3">
          {currentBlank && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm">Basic Details</span>
                <span>
                  {currentBlank.customization.name &&
                  currentBlank.customization.description ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Pricing</span>
                <span>
                  {currentBlank.customization.basePrice.value ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Variants Selected</span>
                <span>
                  {currentBlank.customization.selectedVariants.some(
                    (v: any) => v.selected
                  ) ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};