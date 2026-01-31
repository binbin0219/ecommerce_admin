"use client"

import { useState } from 'react'    
import { IconSun, IconMoon } from '@tabler/icons-react'

export default function DashboardLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div>
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-textSec">Dashboard</h1>
            <p className="text-textPri mt-1">Welcome back, John! Here's what's happening with your store today.</p>
        </div>
        
        {/* Dark Mode Toggle */}
        <button
            onClick={toggleDarkMode}
            className="p-3 rounded-lg bg-bgSec border border-borderPri hover:bg-bgHoverPri transition-colors"
            aria-label="Toggle dark mode"
        >
            {isDarkMode ? (
            <IconSun size={20} className="text-textPri" />
            ) : (
            <IconMoon size={20} className="text-textPri" />
            )}
        </button>
        </div>

        {/* Sample Content - Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
            { label: 'Total Revenue', value: '$45,231', change: '+20.1%', positive: true },
            { label: 'Orders', value: '2,453', change: '+15.3%', positive: true },
            { label: 'Products', value: '543', change: '+5.2%', positive: true },
            { label: 'Customers', value: '1,234', change: '-2.4%', positive: false },
        ].map((stat, index) => (
            <div key={index} className="bg-bgSec p-6 rounded-xl border border-borderPri">
            <p className="text-textPri text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-textSec mb-2">{stat.value}</p>
            <p className={`text-sm font-semibold ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} from last month
            </p>
            </div>
        ))}
        </div>

        {/* Sample Content - Table */}
        <div className="bg-bgSec rounded-xl border border-borderPri p-6">
        <h2 className="text-xl font-bold text-textSec mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
                <tr className="border-b border-borderPri">
                <th className="text-left py-3 px-4 text-textPri font-semibold">Order ID</th>
                <th className="text-left py-3 px-4 text-textPri font-semibold">Customer</th>
                <th className="text-left py-3 px-4 text-textPri font-semibold">Product</th>
                <th className="text-left py-3 px-4 text-textPri font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-textPri font-semibold">Status</th>
                </tr>
            </thead>
            <tbody>
                {[
                { id: '#12345', customer: 'Alice Johnson', product: 'Wireless Headphones', amount: '$129.99', status: 'Delivered' },
                { id: '#12346', customer: 'Bob Smith', product: 'Smart Watch', amount: '$299.99', status: 'Processing' },
                { id: '#12347', customer: 'Carol White', product: 'Laptop Stand', amount: '$49.99', status: 'Shipped' },
                ].map((order, index) => (
                <tr key={index} className="border-b border-borderPri hover:bg-bgHoverPri transition-colors">
                    <td className="py-3 px-4 text-textSec font-medium">{order.id}</td>
                    <td className="py-3 px-4 text-textPri">{order.customer}</td>
                    <td className="py-3 px-4 text-textPri">{order.product}</td>
                    <td className="py-3 px-4 text-textSec font-semibold">{order.amount}</td>
                    <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                        {order.status}
                    </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    </div>
  )
}