"use client";

import { HiCheckCircle } from "react-icons/hi"; // Success icon
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SuccessfulDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SuccessfulDialog({
  open,
  setOpen,
}: SuccessfulDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader>
          {/* Success Icon */}
          <HiCheckCircle className="text-green-200 w-16 h-16 mx-auto mb-4" />
          <DialogTitle className="text-xl font-bold text-center">
            Password Changed
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-sm text-[#667085] text-center">
          Your password has been successfully changed.
        </DialogDescription>

        {/* Footer with Action Button */}
        <DialogFooter>
          <Button
            type="submit"
            className="w-full bg-primary"
            onClick={() => setOpen(false)} // Close modal on click
          >
            Proceed to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
