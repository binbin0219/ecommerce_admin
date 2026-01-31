'use client'

import { IconBell, IconCategory, IconChartBar, IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronUp, IconDiscount, IconLayoutDashboard, IconLogout, IconMessageCircle, IconPackage, IconReceipt, IconSettings, IconShoppingBag, IconTruck, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react"

type MenuItemLabel =
  | 'Dashboard'
  | 'Orders'
  | 'Products'
  | 'Categories'
  | 'Customers'
  | 'Analytics'
  | 'Invoices'
  | 'Promotions'
  | 'Shipping'
  | 'Messages'
  | 'Notifications';

interface MenuItem {
  icon: React.ReactNode
  label: MenuItemLabel
  href: string
  badge?: number
  subItems?: { label: string; href: string }[]
}

const menuItems: MenuItem[] = [
    {
        icon: <IconLayoutDashboard size={20} />,
        label: 'Dashboard',
        href: '/',
    },
    {
        icon: <IconShoppingBag size={20} />,
        label: 'Orders',
        href: '/orders',
        badge: 12,
    },
    {
        icon: <IconPackage size={20} />,
        label: 'Products',
        href: '/products',
        subItems: [
            { label: 'All Products', href: '/products' },
            { label: 'Add Product', href: '/products/add' },
            { label: 'Categories', href: '/products/categories' },
        ],
    },
    {
        icon: <IconCategory size={20} />,
        label: 'Categories',
        href: '/categories',
    },
    {
        icon: <IconUsers size={20} />,
        label: 'Customers',
        href: '/customers',
    },
    {
        icon: <IconChartBar size={20} />,
        label: 'Analytics',
        href: '/analytics',
    },
    {
        icon: <IconReceipt size={20} />,
        label: 'Invoices',
        href: '/invoices',
        subItems: [
            { label: 'All Products', href: '/invoices' },
            { label: 'Add Product', href: '/invoices/add' },
            { label: 'Categories', href: '/invoices/categories' },
        ],
    },
    {
        icon: <IconDiscount size={20} />,
        label: 'Promotions',
        href: '/promotions',
    },
    {
        icon: <IconTruck size={20} />,
        label: 'Shipping',
        href: '/shipping',
    },
    {
        icon: <IconMessageCircle size={20} />,
        label: 'Messages',
        href: '/messages',
        badge: 5,
    },
    {
        icon: <IconBell size={20} />,
        label: 'Notifications',
        href: '/notifications',
        badge: 3,
    },
]

export default function SideBar() {
    const pathname = usePathname();
    const router = useRouter();
    const menuItemToExpand = menuItems.find(i => i.subItems && i.href && pathname.startsWith(i.href));
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedItemLabel, setExpandedItemLabel] = useState<MenuItemLabel | null>(menuItemToExpand?.label ?? null);
    const isOpened = useMemo(() => !isCollapsed, [isCollapsed]);

    const toggleCollapsed = () => {
        setIsCollapsed(!isCollapsed);
    }

    const toggleExpanded = (label: MenuItemLabel) => {
        if(expandedItemLabel === label) {
            setExpandedItemLabel(null);
        } else {
            setExpandedItemLabel(label);
        }
    }

    return (
        <div
        className={`
            h-svh scrollbar-custom
            bg-bgSec border border-borderPri flex flex-col overflow-x-hidden
            transition-all duration-300 ease-in-out
            ${isCollapsed ? 'w-20' : 'w-64'}`
        }>
            {/* Header */}
            <div
            className={`
                flex p-4 w-full border-b items-center
                ${isCollapsed ? 'justify-center' : 'justify-between'}
            `}>
                {isOpened && (
                    <div className={`flex gap-3 items-center`}>
                        <div className="bg-gradient-to-br from-primary p-2 rounded-lg text-white">
                            <IconShoppingBag size={20}/>
                        </div>
                        <p className="font-bold">StoreName</p>
                    </div>
                )}
                <button onClick={toggleCollapsed} className={`p-2 rounded-lg hover:bg-bgHoverPri transition-colors`}>
                    {isCollapsed && (
                        <IconChevronRight size={18}/>
                    )}
                    {isOpened && (
                        <IconChevronLeft size={18}/>
                    )}
                </button>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2 px-2 py-4 border-b">
                {menuItems.map(item => {
                    const isActive = (!item.subItems && item.href === pathname) || (item.subItems && pathname.startsWith(item.href));
                    const expanded = expandedItemLabel === item.label;

                    return (
                        <div key={item.label} className="flex flex-col">
                            <button 
                            onClick={() => item.subItems ? toggleExpanded(item.label) : router.push(item.href!)}
                            className={`
                                flex rounded-lg px-3 py-2.5 items-center 
                                ${expanded && 'bg-bgHoverPri'}
                                ${isActive ? 'bg-primary' : 'hover:bg-bgHoverPri transition-colors'}
                                ${isCollapsed ? 'justify-center' : 'justify-between'}
                            `}>
                                <div className={`
                                    flex gap-3 items-center
                                    ${isActive ? 'text-white' : 'text-textPri'}
                                `}>
                                    {item.icon}
                                    {isOpened && (
                                        <p className="font-medium text-sm">{item.label}</p>
                                    )}
                                </div>
                                {isOpened && item.badge && (
                                    <span className={`text-xs ${isActive ? 'text-white' : 'text-primary'}`}>{item.badge}</span>
                                )}
                                {isOpened && item.subItems && (
                                    <IconChevronDown size={18} className={`transition-transform ${expanded && '-rotate-180'}`}/>
                                )}
                            </button>
                            {item.subItems && (
                                <>
                                    <div className={`flex flex-col gap-2 overflow-hidden transition-all duration-500 ${expanded ? 'max-h-[200px]' : 'max-h-0'}`}>
                                        <div className="mt-1"></div>
                                        {item.subItems.map(subItem => {
                                            const isActive = subItem.href === pathname;

                                            return (
                                                <Link
                                                key={subItem.label}
                                                href={subItem.href} 
                                                className={`
                                                    ms-8 flex rounded-lg px-3 py-2.5 items-center 
                                                    ${isActive ? 'bg-primary' : 'hover:bg-bgHoverPri transition-colors'}
                                                    ${isCollapsed ? 'justify-center' : 'justify-between'}
                                                `}>
                                                    <div className={`
                                                        flex gap-3 items-center
                                                        ${isActive ? 'text-white' : 'text-textPri'}
                                                    `}>
                                                        {isOpened && (
                                                            <p className="font-medium text-sm">{subItem.label}</p>
                                                        )}
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                        <div className="mt-1"></div>
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Setting */}
            <div className="px-2 py-4 border-b">
                <button className={`group w-full flex rounded-lg px-3 py-2.5 items-center ${isCollapsed && 'justify-center'} hover:bg-bgHoverPri transition-colors`}>
                    <div className={`
                        flex gap-3 items-center
                    `}>
                        <IconSettings size={20}/>
                        {isOpened && (
                            <p className="font-medium text-sm">Settings</p>
                        )}
                    </div>
                </button>
            </div>

            {/* Footer */}
            <div className="px-2 py-4 flex justify-center">
                <button className="group flex items-center gap-2 hover:bg-bgHoverPri transition-colors rounded-lg p-3 w-full">
                    <div className="rounded-full min-w-10 h-10 bg-gradient-to-br from-primary font-bold flex justify-center items-center text-white">
                        JS
                    </div>
                    {isOpened && (
                        <>
                            <div className="flex flex-col text-start">
                                <p className="font-medium text-sm">
                                    John Seller
                                </p>
                                <p className="text-xs text-textPri">
                                    john@store.com
                                </p>
                            </div>
                            <IconLogout size={18} className="group-hover:text-red-500 ms-auto"/>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}