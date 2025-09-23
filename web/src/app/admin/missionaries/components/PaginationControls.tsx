import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Pagination as PaginationType } from "@/lib/types";

interface PaginationControlsProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({ pagination, onPageChange }: PaginationControlsProps) {
  const { page, pages, total } = pagination;

  if (pages <= 1) {
    return null; // Don't render pagination if there's only one page
  }
  
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <p className="text-sm text-gray-600">
        Showing page {page} of {pages} ({total} missionaries)
      </p>
      <UIPagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(page - 1)} aria-disabled={page === 1} tabIndex={page === 1 ? -1 : 0} style={{ pointerEvents: page === 1 ? "none" : undefined, opacity: page === 1 ? 0.5 : 1 }} />
          </PaginationItem>
          
          {Array.from({ length: pages }).map((_, idx) => (
            <PaginationItem key={idx}>
              <PaginationLink isActive={page === idx + 1} onClick={() => onPageChange(idx + 1)}>
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange(page + 1)} aria-disabled={page === pages} tabIndex={page === pages ? -1 : 0} style={{ pointerEvents: page === pages ? "none" : undefined, opacity: page === pages ? 0.5 : 1 }} />
          </PaginationItem>
        </PaginationContent>
      </UIPagination>
    </div>
  );
}