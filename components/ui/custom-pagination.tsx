"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = "",
}: CustomPaginationProps) {
  const [paginationItems, setPaginationItems] = useState<(number | string)[]>(
    []
  );

  useEffect(() => {
    // Generate pagination items array
    const range = (start: number, end: number) => {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const generatePagination = () => {
      // If total pages is 7 or less, we show all pages without dots
      if (totalPages <= 7) {
        return range(1, totalPages);
      }

      // We always show first and last page
      const firstPageIndex = 1;
      const lastPageIndex = totalPages;

      // Calculate left and right siblings
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(
        currentPage + siblingCount,
        totalPages
      );

      // Should show dots when there's more than 1 page number hidden
      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

      // Case 1: Show left dots but no right dots
      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * siblingCount;
        const rightRange = range(totalPages - rightItemCount + 1, totalPages);
        return [1, "left-dots", ...rightRange];
      }

      // Case 2: Show right dots but no left dots
      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount;
        const leftRange = range(1, leftItemCount);
        return [...leftRange, "right-dots", totalPages];
      }

      // Case 3: Show both left and right dots
      if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = range(leftSiblingIndex, rightSiblingIndex);
        return [1, "left-dots", ...middleRange, "right-dots", totalPages];
      }
    };

    setPaginationItems(generatePagination() || []);
  }, [currentPage, totalPages, siblingCount]);

  return (
    <nav
      className={`flex items-center justify-center px-4 py-3 sm:px-6 gap-1 ${className}`}
      aria-label="Pagination"
    >
      <div className="flex items-center justify-between w-full">
        <div className="hidden sm:block">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>

        <div className="flex items-center gap-1 justify-end sm:justify-center w-full sm:w-auto">
          {/* Previous Page Button */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Mobile indicator */}
          <span className="text-sm text-muted-foreground sm:hidden">
            {currentPage} / {totalPages}
          </span>

          {/* Desktop page numbers */}
          <div className="hidden sm:flex space-x-1">
            {paginationItems.map((item, index) => {
              if (typeof item === "string") {
                return (
                  <Button
                    key={`dots-${index}`}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-default"
                    disabled
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                );
              }

              return (
                <Button
                  key={item}
                  variant={currentPage === item ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPageChange(item)}
                  aria-current={currentPage === item ? "page" : undefined}
                >
                  {item}
                </Button>
              );
            })}
          </div>

          {/* Next Page Button */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
