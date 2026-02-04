'use client'

import { IconEditCircle, IconTrash } from "@tabler/icons-react"
import Pagination, { PaginationNewPageCallback } from "./Pagination"
import Tooltip from "./Tooltip/Tooltip"

export type DataTableHeader = {
    name: string
    key: string
}

type Props<ItemType> = {
    headers: DataTableHeader[]
    items: ItemType[]
    totalItems: number;
    onNewPage: PaginationNewPageCallback;
    onEdit?: (item: ItemType) => void;
    onDelete?: (item: ItemType) => void;
}

export default function DataTable<ItemType>({
    headers,
    items,
    totalItems,
    onNewPage,
    onEdit,
    onDelete,
}: Props<ItemType>) {

    return (
        <Pagination totalItems={totalItems} onNewPage={onNewPage}>
            <div className="w-full overflow-x-auto rounded-lg border border-borderPri bg-bgPri">
                <table className="w-full border-separate border-spacing-y-4 px-2">
                    <thead className="sticky top-0 z-10">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header.key}
                                    className="px-4 py-3 text-left font-semibold text-textPri border-b border-borderPri"
                                >
                                    {header.name}
                                </th>
                            ))}
                            <th
                                className="px-4 py-3 text-left font-semibold text-textPri border-b border-borderPri"
                            >
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={headers.length}
                                    className="px-4 py-6 text-center text-textSec"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            items.map((item, index) => (
                                <tr
                                    key={index}
                                    className="
                                        cursor-pointer
                                        even:bg-bgSec
                                        hover:bg-bgHoverPri
                                        hover:-translate-y-0.5
                                        transition-all
                                        duration-300
                                    "
                                >
                                    {headers.map((header) => (
                                        <td
                                            key={header.key}
                                            className="px-4 py-3 text-textPri border-b border-t first:border-s last:border-e first:rounded-s-lg last:rounded-e-lg border-borderPri"
                                        >
                                            {/* @ts-ignore */}
                                            {item[header.key as keyof ItemType]}
                                        </td>
                                    ))}
                                    <td
                                        className="
                                            px-4 py-3 text-textPri border-b border-t first:border-s last:border-e first:rounded-s-lg last:rounded-e-lg border-borderPri
                                        "
                                    >
                                        <div className="flex gap-2">
                                            <Tooltip text="Edit">
                                                <button onClick={() => onEdit?.(item)} className="hover:text-primary transition-colors">
                                                    <IconEditCircle size={20}/>
                                                </button>
                                            </Tooltip>
                                            <Tooltip text="Delete">
                                                <button onClick={() => onDelete?.(item)}  className="hover:text-primary transition-colors">
                                                    <IconTrash size={20}/>
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Pagination>
    )
}
