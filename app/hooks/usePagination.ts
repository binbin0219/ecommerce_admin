import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export type UsePaginationReturn = {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
};

type UsePaginationProps = {
  totalItems: number;
  defaultPageSize?: number;
};

export function usePagination({
  totalItems,
  defaultPageSize = 5,
}: UsePaginationProps): UsePaginationReturn {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ===== 从 URL 读取 pageSize =====
  const pageSize = useMemo(() => {
    const size = Number(searchParams.get("pageSize"));
    return isNaN(size) || size <= 0 ? defaultPageSize : size;
  }, [searchParams, defaultPageSize]);

  // ===== 计算 totalPages =====
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  // ===== 从 URL 读取 currentPage =====
  const currentPage = useMemo(() => {
    const page = Number(searchParams.get("page"));
    if (isNaN(page)) return 1;
    return Math.min(Math.max(page, 1), totalPages);
  }, [searchParams, totalPages]);

  // ===== 更新 URL 工具函数 =====
  const updateParams = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      newSearchParams.set(key, value);
    });

    router.push(`?${newSearchParams.toString()}`);
  };

  // ===== 分页操作 =====
  const goToPage = (page: number) => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    updateParams({ page: String(safePage) });
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  // ===== 修改 pageSize =====
  const setPageSize = (size: number) => {
    if (size <= 0) return;

    // pageSize 改变时，通常回到第一页
    updateParams({
      pageSize: String(size),
      page: "1",
    });
  };

  return {
    totalItems,
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    setPageSize,
    nextPage,
    prevPage,
  };
}
