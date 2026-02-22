'use client'

import { IconEditCircle, IconTrash } from "@tabler/icons-react"
import Tooltip from "./Tooltip/Tooltip"

export type DataTableHeaderType =
    | 'text'
    | 'number'
    | 'currency'
    | 'boolean'
    | 'date'
    | 'custom';

export type DataTableHeader<ItemType = any> = {
    name: string;
    key: string;
    type?: DataTableHeaderType;
    render?: (value: any, item: ItemType) => React.ReactNode;
};

type Props<ItemType> = {
    headers: DataTableHeader[]
    items: ItemType[]
    onEdit?: (item: ItemType) => void;
    onDelete?: (item: ItemType) => void;
}

export default function DataTable<ItemType>({
    headers,
    items,
    onEdit,
    onDelete,
}: Props<ItemType>) {

    function formatValue(type: DataTableHeaderType | undefined, value: any) {
        if (value == null) return '-';

        switch (type) {
            case 'currency':
                return `RM ${Number(value).toFixed(2)}`;

            case 'boolean':
                return value ? '已上架' : '已下架';

            case 'date':
                return new Date(value).toLocaleString('zh-CN');

            case 'number':
                return value;

            default:
                return value;
        }
    }

    return (
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
                        <th className="px-4 py-3 text-left font-semibold text-textPri border-b border-borderPri">
                            操作
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td
                                colSpan={headers.length + 1}
                                className="px-4 py-6 text-center text-textSec"
                            >
                                暂无数据
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
                                {headers.map((header) => {
                                    const value = item[header.key as keyof ItemType];

                                    return (
                                        <td
                                            key={String(header.key)}
                                            className="px-4 py-3 text-textPri border-b border-t first:border-s last:border-e first:rounded-s-lg last:rounded-e-lg border-borderPri"
                                        >
                                            {header.render
                                                ? header.render(value, item)
                                                : formatValue(header.type, value)}
                                        </td>
                                    );
                                })}

                                <td className="px-4 py-3 text-textPri border-b border-t first:border-s last:border-e first:rounded-s-lg last:rounded-e-lg border-borderPri">
                                    <div className="flex gap-2">
                                        <Tooltip text="编辑">
                                            <button
                                                onClick={() => onEdit?.(item)}
                                                className="hover:text-appPrimary transition-colors"
                                            >
                                                <IconEditCircle size={20}/>
                                            </button>
                                        </Tooltip>
                                        <Tooltip text="删除">
                                            <button
                                                onClick={() => onDelete?.(item)}
                                                className="hover:text-appPrimary transition-colors"
                                            >
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
    )
}