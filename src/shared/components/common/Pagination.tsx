import type { PaginationMeta } from "@/shared/types";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/shared/components/ui/pagination";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface PaginationProp {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ meta, onPageChange, className }: PaginationProp) {
  const { currentPage, totalPages, hasPreviousPage, hasNextPage } = meta;
  if (totalPages <= 1) return null; //

  const getPagination = (): (number | "...")[] => {
    const page: (number | "...")[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i < totalPages; i++) page.push(i);
    } else {
      page.push(1);
      if (currentPage > 3) page.push("...");
      const start = Math.min(2, currentPage - 1);
      const end = Math.max(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) page.push(i);
      if (currentPage < totalPages - 2) page.push("...");
      page.push(totalPages);
    }

    return page;
  };
  return (
    <PaginationRoot className={className}>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </PaginationItem>
        {getPagination().map((p, i) =>
          p === "..." ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis></PaginationEllipsis>
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(p);
                }}
                isActive={currentPage === p}
                className="cursor-pointer"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
