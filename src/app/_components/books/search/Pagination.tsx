// src/components/Pagination.tsx
import type React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <div className="mt-4 flex justify-center items-center gap-2">
    <Button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="bg-gray-700 hover:bg-gray-600"
    >
      Previous
    </Button>
    <span>{`Page ${currentPage} of ${totalPages}`}</span>
    <Button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="bg-gray-700 hover:bg-gray-600"
    >
      Next
    </Button>
  </div>
);

export default Pagination;