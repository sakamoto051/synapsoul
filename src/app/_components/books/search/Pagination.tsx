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
  <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
    <Button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="bg-gray-700 hover:bg-gray-600 w-full sm:w-auto"
    >
      前へ
    </Button>
    <span className="text-sm sm:text-base">{` ${currentPage} of ${totalPages}`}</span>
    <Button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="bg-gray-700 hover:bg-gray-600 w-full sm:w-auto"
    >
      次へ
    </Button>
  </div>
);

export default Pagination;
