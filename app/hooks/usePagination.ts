import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export type UsePaginationReturn = {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
};

type UsePaginationProps = {
  totalItems: number;
  pageSize?: number;
};

export function usePagination({
  totalItems,
  pageSize = 10,
}: UsePaginationProps): UsePaginationReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);
  const currentPage = isNaN(Number(searchParams.get('page'))) 
    ? 1 
    : Math.min(Math.max(Number(searchParams.get('page')), 1), totalPages);

  const setCurrentPage = (page: number) => {
    page = Math.min(Math.max(page, 1), totalPages)
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', `${page}`);
    router.push(`?${newSearchParams.toString()}`);
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const nextPage = () => {
    setCurrentPage(Math.min(currentPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  return {
    totalItems,
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
  };
}