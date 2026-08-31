'use client'

import { useAppSelector } from "@/redux/hooks";
import { selectSeller } from "@/redux/slices/sellerSlice";
import { IconBell, IconCategory, IconChartBar, IconChevronLeft, IconChevronRight, IconDiscount, IconLayoutDashboard, IconLock, IconMessageCircle, IconPackage, IconReceipt, IconSettings, IconShoppingBag, IconTruck, IconUsers } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react"

interface MenuItem {
  icon: React.ReactNode
  label: string
  href: string
  locked?: boolean
}

const menuItems: MenuItem[] = [
  { icon: <IconLayoutDashboard size={20} />, label: 'Dashboard', href: '/' },
  { icon: <IconPackage size={20} />, label: 'Products', href: '/products' },
  { icon: <IconShoppingBag size={20} />, label: 'Orders', href: '/orders', locked: true },
  { icon: <IconCategory size={20} />, label: 'Categories', href: '/categories', locked: true },
  { icon: <IconUsers size={20} />, label: 'Customers', href: '/customers', locked: true },
  { icon: <IconChartBar size={20} />, label: 'Analytics', href: '/analytics', locked: true },
  { icon: <IconReceipt size={20} />, label: 'Invoices', href: '/invoices', locked: true },
  { icon: <IconDiscount size={20} />, label: 'Promotions', href: '/promotions', locked: true },
  { icon: <IconTruck size={20} />, label: 'Shipping', href: '/shipping', locked: true },
  { icon: <IconMessageCircle size={20} />, label: 'Messages', href: '/messages', locked: true },
  { icon: <IconBell size={20} />, label: 'Notifications', href: '/notifications', locked: true },
]

export default function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const seller = useAppSelector(selectSeller);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isOpened = useMemo(() => !isCollapsed, [isCollapsed]);

  return (
    <div
      className={`
        h-svh scrollbar-custom
        bg-bgSec border border-borderPri flex flex-col overflow-x-hidden
        transition-all duration-300 ease-in-out sticky top-0
        ${isCollapsed ? 'w-20' : 'w-64'}`
      }>
      {/* Header */}
      <div className={`flex p-4 w-full border-b items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {isOpened && (
          <div className="flex gap-3 items-center">
            <div className="bg-gradient-to-br from-appPrimary p-2 rounded-lg text-white">
              <IconShoppingBag size={20} />
            </div>
            <p className="font-bold">{seller?.name ?? 'Store Admin'}</p>
          </div>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-bgHoverPri transition-colors">
          {isCollapsed ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2 px-2 py-4 border-b">
        {menuItems.map(item => {
          const isActive = !item.locked && item.href === pathname;

          return (
            <button
              key={item.label}
              disabled={item.locked}
              title={item.locked ? 'Coming soon' : undefined}
              onClick={() => !item.locked && router.push(item.href)}
              className={`
                flex rounded-lg px-3 py-2.5 items-center
                ${isActive ? 'bg-appPrimary' : 'hover:bg-bgHoverPri transition-colors'}
                ${item.locked ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''}
                ${isCollapsed ? 'justify-center' : 'justify-between'}
              `}>
              <div className={`flex gap-3 items-center ${isActive ? 'text-white' : 'text-textPri'}`}>
                {item.icon}
                {isOpened && <p className="font-medium text-sm">{item.label}</p>}
              </div>
              {isOpened && item.locked && <IconLock size={14} className="text-textPri" />}
            </button>
          )
        })}
      </div>

      {/* Settings (locked) */}
      <div className="px-2 py-4 border-b">
        <button
          disabled
          title="Coming soon"
          className={`w-full flex rounded-lg px-3 py-2.5 items-center opacity-40 cursor-not-allowed ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex gap-3 items-center">
            <IconSettings size={20} />
            {isOpened && <p className="font-medium text-sm">Settings</p>}
          </div>
          {isOpened && <IconLock size={14} className="text-textPri" />}
        </button>
      </div>

      {/* Footer */}
      <div className="px-2 py-4 flex justify-center">
        <div className="flex items-center gap-2 rounded-lg p-3 w-full">
          <div className="rounded-full min-w-10 h-10 bg-gradient-to-br from-appPrimary font-bold flex justify-center items-center text-white">
            {(seller?.name ?? 'S').slice(0, 2).toUpperCase()}
          </div>
          {isOpened && (
            <div className="flex flex-col text-start overflow-hidden">
              <p className="font-medium text-sm truncate">{seller?.name ?? 'Store Admin'}</p>
              <p className="text-xs text-textPri truncate">{seller?.username ?? ''}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
