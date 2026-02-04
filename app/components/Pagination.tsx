'use client'

import { usePagination } from "@/hooks/usePagination";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";
import { useEffect } from "react";

export type PaginationNewPageCallback = (currentPage: number, pageSize: number) => Promise<void> | void;

type Props = {
    children?: React.ReactNode;
    totalItems: number;
    onNewPage: PaginationNewPageCallback;
}

export default function Pagination({ children, totalItems, onNewPage }: Props) {
    const pagination = usePagination({
        totalItems: totalItems,
        pageSize: 5,
    })

    const showingItemCountStart = (pagination.pageSize * pagination.currentPage) - pagination.pageSize + 1;
    const showingItemCountEnd = Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems);
    const prevPageList = Array.from({ length: 2 }, (_, i) => i + 1)
        .reverse()
        .map(prevPageCount => {
        return pagination.currentPage - prevPageCount;
        })
        .filter(prevPage => prevPage >= 1);
    const nextPageList = Array.from({ length: 2 }, (_, i) => i + 1)
        .map(nextPageCount => {
        return pagination.currentPage + nextPageCount;
        })
        .filter(nextPage => nextPage <= pagination.totalPages);

    useEffect(() => {
        onNewPage(pagination.currentPage, pagination.pageSize);
    }, [pagination.currentPage, pagination.pageSize]);

    return (
        <>
            {children}
            {/* Pagination */}
            <div className="flex gap-4 flex-col sm:flex-row justify-center sm:justify-between items-center p-5 rounded-lg bg-bgSecondary border sticky bottom-5 mt-3">
                <p className="text-sm">
                    Showing {showingItemCountStart}–{showingItemCountEnd} of {totalItems} items
                </p>
                <div className="flex gap-1">
                    <button onClick={() => pagination.goToPage(1)} className="border rounded-md px-2 py-2 text-sm hover:bg-bgHoverPri transition-colors">
                        <IconChevronsLeft size={20}/>
                    </button>
                    <button onClick={pagination.prevPage} className="border rounded-md px-2 py-2 text-sm hover:bg-bgHoverPri transition-colors">
                        <IconChevronLeft size={20}/>
                    </button>
                    {prevPageList.map(prevPage => (
                        <button
                        key={prevPage}
                        onClick={() => pagination.goToPage(prevPage)} 
                        className="border rounded-md px-4 py-2 text-sm hover:bg-bgHoverPri transition-colors">
                            {prevPage}
                        </button>
                    ))}
                    <button className="border rounded-md px-4 py-2 text-sm bg-primary text-white transition-colors">{pagination.currentPage}</button>
                    {nextPageList.map(nextPage => (
                        <button 
                        key={nextPage}
                        onClick={() => pagination.goToPage(nextPage)} 
                        className="border rounded-md px-4 py-2 text-sm hover:bg-bgHoverPri transition-colors">
                            {nextPage}
                        </button>
                    ))}
                    <button onClick={pagination.nextPage} className="border rounded-md px-2 py-2 text-sm hover:bg-bgHoverPri transition-colors">
                        <IconChevronRight size={20}/>
                    </button>
                    <button onClick={() => pagination.goToPage(pagination.totalPages)} className="border rounded-md px-2 py-2 text-sm hover:bg-bgHoverPri transition-colors">
                        <IconChevronsRight size={20}/>
                    </button>
                </div>
            </div>
        </>
    )
}