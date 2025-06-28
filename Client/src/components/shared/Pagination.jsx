
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  siblingCount = 1,
  className,
}) => {
  const generatePageNumbers = () => {
    const pages = [];

    if (showFirstLast) {
      pages.push(1);
    }

    const start = Math.max(showFirstLast ? 2 : 1, currentPage - siblingCount);
    const end = Math.min(
      showFirstLast ? totalPages - 1 : totalPages,
      currentPage + siblingCount
    );

    if (showFirstLast && start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      if (showFirstLast || i !== 1) {
        pages.push(i);
      }
    }

    if (showFirstLast && end < totalPages - 1) {
      pages.push("...");
    }

    if (showFirstLast && totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={cn("flex items-center space-x-1", className)}
      aria-label="Pagination Navigation"
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:ml-2">Previous</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-9 h-9"
                aria-hidden="true"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          }

          const isCurrentPage = page === currentPage;

          return (
            <Button
              key={page}
              variant={isCurrentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              aria-current={isCurrentPage ? "page" : undefined}
              aria-label={`Go to page ${page}`}
              className="w-9 h-9"
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Go to next page"
      >
        <span className="sr-only sm:not-sr-only sm:mr-2">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};