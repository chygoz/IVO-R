import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessDialogProps {
  isShowingSuccess: boolean;
  setIsShowingSuccess: (isOpen: boolean) => void;
  customizedBlanks: any[];
  handleGoToProducts: () => void;
  handleViewSubmission: () => void;
}

export const SuccessDialog = ({
  isShowingSuccess,
  setIsShowingSuccess,
  customizedBlanks,
  handleGoToProducts,
  handleViewSubmission,
}: SuccessDialogProps) => {
  return (
    <Dialog open={isShowingSuccess} onOpenChange={setIsShowingSuccess}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            Customization Submitted
          </DialogTitle>
          <DialogDescription>
            Your customized blanks have been submitted successfully
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
                  Submission successful
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your {customizedBlanks.length} customized{" "}
                    {customizedBlanks.length === 1
                      ? "blank has"
                      : "blanks have"}{" "}
                    been submitted. You can view their status in the
                    submissions section.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={handleGoToProducts}>
            Go to Products
          </Button>
          <Button
            onClick={handleViewSubmission}
            className="bg-blue-600 hover:bg-blue-700"
          >
            View Submission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};