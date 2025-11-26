import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";

interface EmptyStateProps {
  handleAddMoreBlanks: () => void;
}

export const EmptyState = ({ handleAddMoreBlanks }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
      <h2 className="mt-4 text-lg font-medium">No Blanks Selected</h2>
      <p className="mt-2 text-muted-foreground">
        You haven&apos;t selected any blanks to customize.
      </p>
      <Button
        variant="outline"
        className="mt-6"
        onClick={handleAddMoreBlanks}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Browse Blanks
      </Button>
    </div>
  );
};