'use client'

import { useState } from 'react'
import {
  IconSearch,
  IconFilter,
  IconPlus,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconDownload,
  IconUpload,
  IconSortAscending,
  IconSortDescending,
  IconX,
  IconCheck,
  IconClock,
  IconAlertCircle,
} from '@tabler/icons-react'
import Dialog from '@/components/Dialog'
import ProductDialog from '../ProductDialog'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'out_of_stock'
  image: string
  sales: number
  createdAt: string
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'sales'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [productDialogOpen, setProductDialogOpen] = useState<boolean>(false);

  // Mock data
  const products: Product[] = [
        {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        sku: 'WBH-001',
        category: 'Electronics',
        price: 129.99,
        stock: 45,
        status: 'active',
        image: '🎧',
        sales: 234,
        createdAt: '2024-01-15',
        },
        {
        id: '2',
        name: 'Smart Watch Pro',
        sku: 'SWP-002',
        category: 'Electronics',
        price: 299.99,
        stock: 0,
        status: 'out_of_stock',
        image: '⌚',
        sales: 189,
        createdAt: '2024-01-20',
        },
        {
        id: '3',
        name: 'Laptop Stand Aluminum',
        sku: 'LSA-003',
        category: 'Accessories',
        price: 49.99,
        stock: 120,
        status: 'active',
        image: '💻',
        sales: 567,
        createdAt: '2024-02-01',
        },
        {
        id: '4',
        name: 'USB-C Hub 7-in-1',
        sku: 'UCH-004',
        category: 'Accessories',
        price: 39.99,
        stock: 78,
        status: 'active',
        image: '🔌',
        sales: 423,
        createdAt: '2024-02-05',
        },
        {
        id: '5',
        name: 'Mechanical Keyboard RGB',
        sku: 'MKR-005',
        category: 'Electronics',
        price: 159.99,
        stock: 32,
        status: 'active',
        image: '⌨️',
        sales: 312,
        createdAt: '2024-01-10',
        },
        {
        id: '6',
        name: 'Wireless Mouse Ergonomic',
        sku: 'WME-006',
        category: 'Electronics',
        price: 29.99,
        stock: 156,
        status: 'active',
        image: '🖱️',
        sales: 678,
        createdAt: '2024-01-25',
        },
        {
        id: '7',
        name: 'Phone Case Premium Leather',
        sku: 'PCP-007',
        category: 'Accessories',
        price: 24.99,
        stock: 5,
        status: 'active',
        image: '📱',
        sales: 891,
        createdAt: '2024-02-10',
        },
        {
        id: '8',
        name: 'Portable Charger 20000mAh',
        sku: 'PC2-008',
        category: 'Electronics',
        price: 44.99,
        stock: 89,
        status: 'draft',
        image: '🔋',
        sales: 156,
        createdAt: '2024-02-12',
        },
  ]

  const categories = ['all', 'Electronics', 'Accessories', 'Clothing', 'Home & Garden']
  const statuses = ['all', 'active', 'draft', 'out_of_stock']

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1
      if (sortBy === 'name') return a.name.localeCompare(b.name) * order
      if (sortBy === 'price') return (a.price - b.price) * order
      if (sortBy === 'stock') return (a.stock - b.stock) * order
      if (sortBy === 'sales') return (a.sales - b.sales) * order
      return 0
    })

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    }
  }

  const getStatusIcon = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return <IconCheck size={14} />
      case 'draft':
        return <IconClock size={14} />
      case 'out_of_stock':
        return <IconAlertCircle size={14} />
    }
  }

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'out_of_stock':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }
  }

  const totalValue = filteredProducts.reduce((sum, p) => sum + p.price * p.stock, 0)
  const lowStockCount = filteredProducts.filter((p) => p.stock < 20).length

  return (
    <>
        {/* Header */}
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
                <div>
                <h1 className="text-3xl font-bold text-textSec mb-1">Products</h1>
                <p className="text-textPri">Manage your store inventory</p>
                </div>
                <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-bgSec border border-borderPri text-textPri rounded-lg hover:bg-bgHoverPri transition-colors">
                    <IconUpload size={18} />
                    <span className="font-medium">Import</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-bgSec border border-borderPri text-textPri rounded-lg hover:bg-bgHoverPri transition-colors">
                    <IconDownload size={18} />
                    <span className="font-medium">Export</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    <IconPlus size={18} />
                    <span className="font-medium">Add Product</span>
                </button>
                </div>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="card">
                <p className="text-textPri text-sm mb-1">Total Products</p>
                <p className="text-2xl font-bold text-textSec">{filteredProducts.length}</p>
            </div>
            <div className="card">
                <p className="text-textPri text-sm mb-1">Total Value</p>
                <p className="text-2xl font-bold text-textSec">${totalValue.toLocaleString()}</p>
            </div>
            <div className="card">
                <p className="text-textPri text-sm mb-1">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-500">{lowStockCount}</p>
            </div>
            <div className="card">
                <p className="text-textPri text-sm mb-1">Total Sales</p>
                <p className="text-2xl font-bold text-textSec">
                {filteredProducts.reduce((sum, p) => sum + p.sales, 0)}
                </p>
            </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-bgSec rounded-xl border border-borderPri p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                <IconSearch
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-textPri"
                />
                <input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-bgPri border border-borderPri rounded-lg text-textSec placeholder:text-textPri focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                </div>

                {/* Filter Button */}
                <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                    showFilters
                    ? 'bg-primary text-white border-primary'
                    : 'bg-bgPri border-borderPri text-textPri hover:bg-bgHoverPri'
                }`}
                >
                <IconFilter size={18} />
                <span className="font-medium">Filters</span>
                {(selectedCategory !== 'all' || selectedStatus !== 'all') && (
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                )}
                </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
                <div className="mt-4 pt-4 border-t border-borderPri">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category Filter */}
                    <div>
                    <label className="block text-sm font-medium text-textPri mb-2">
                        Category
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-bgPri border border-borderPri rounded-lg text-textSec focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                        ))}
                    </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                    <label className="block text-sm font-medium text-textPri mb-2">
                        Status
                    </label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-bgPri border border-borderPri rounded-lg text-textSec focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                        ))}
                    </select>
                    </div>
                </div>

                {/* Clear Filters */}
                {(selectedCategory !== 'all' || selectedStatus !== 'all') && (
                    <button
                    onClick={() => {
                        setSelectedCategory('all')
                        setSelectedStatus('all')
                    }}
                    className="mt-3 flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                    <IconX size={16} />
                    Clear all filters
                    </button>
                )}
                </div>
            )}
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex items-center justify-between">
                <p className="text-textSec font-medium">
                {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-bgSec border border-borderPri text-textPri rounded-lg hover:bg-bgHoverPri transition-colors">
                    Bulk Edit
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Delete Selected
                </button>
                <button
                    onClick={() => setSelectedProducts([])}
                    className="p-2 hover:bg-bgHoverPri rounded-lg transition-colors"
                >
                    <IconX size={18} className="text-textPri" />
                </button>
                </div>
            </div>
        )}

        {/* Products Table */}
        <div className="bg-bgSec rounded-xl border border-borderPri overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="bg-bgPri border-b border-borderPri">
                    <tr>
                    <th className="px-4 py-3 text-left">
                        <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-borderPri"
                        />
                    </th>
                    <th className="px-4 py-3 text-left text-textPri text-sm font-semibold">
                        Product
                    </th>
                    <th className="px-4 py-3 text-left text-textPri text-sm font-semibold">
                        SKU
                    </th>
                    <th className="px-4 py-3 text-left text-textPri text-sm font-semibold">
                        Category
                    </th>
                    <th
                        className="px-4 py-3 text-left text-textPri text-sm font-semibold cursor-pointer hover:text-primary transition-colors"
                        onClick={() => toggleSort('price')}
                    >
                        <div className="flex items-center gap-1">
                        Price
                        {sortBy === 'price' && (
                            sortOrder === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                        )}
                        </div>
                    </th>
                    <th
                        className="px-4 py-3 text-left text-textPri text-sm font-semibold cursor-pointer hover:text-primary transition-colors"
                        onClick={() => toggleSort('stock')}
                    >
                        <div className="flex items-center gap-1">
                        Stock
                        {sortBy === 'stock' && (
                            sortOrder === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                        )}
                        </div>
                    </th>
                    <th
                        className="px-4 py-3 text-left text-textPri text-sm font-semibold cursor-pointer hover:text-primary transition-colors"
                        onClick={() => toggleSort('sales')}
                    >
                        <div className="flex items-center gap-1">
                        Sales
                        {sortBy === 'sales' && (
                            sortOrder === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                        )}
                        </div>
                    </th>
                    <th className="px-4 py-3 text-left text-textPri text-sm font-semibold">
                        Status
                    </th>
                    <th className="px-4 py-3 text-right text-textPri text-sm font-semibold">
                        Actions
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                    <tr
                        key={product.id}
                        className="border-b border-borderPri hover:bg-bgHoverPri transition-colors"
                    >
                        <td className="px-4 py-4">
                        <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleSelectProduct(product.id)}
                            className="rounded border-borderPri"
                        />
                        </td>
                        <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-bgPri rounded-lg flex items-center justify-center text-2xl">
                            {product.image}
                            </div>
                            <div>
                            <p className="font-semibold text-textSec">{product.name}</p>
                            <p className="text-sm text-textPri">{product.createdAt}</p>
                            </div>
                        </div>
                        </td>
                        <td className="px-4 py-4">
                        <span className="font-mono text-sm text-textPri">{product.sku}</span>
                        </td>
                        <td className="px-4 py-4">
                        <span className="text-textPri">{product.category}</span>
                        </td>
                        <td className="px-4 py-4">
                        <span className="font-semibold text-textSec">${product.price}</span>
                        </td>
                        <td className="px-4 py-4">
                        <span
                            className={`font-medium ${
                            product.stock < 20 ? 'text-red-500' : 'text-textSec'
                            }`}
                        >
                            {product.stock}
                        </span>
                        </td>
                        <td className="px-4 py-4">
                        <span className="text-textPri">{product.sales}</span>
                        </td>
                        <td className="px-4 py-4">
                        <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            product.status
                            )}`}
                        >
                            {getStatusIcon(product.status)}
                            {product.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        </td>
                        <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                            <button className="p-2 hover:bg-bgPri rounded-lg transition-colors group">
                            <IconEye size={18} className="text-textPri group-hover:text-primary" />
                            </button>
                            <button className="p-2 hover:bg-bgPri rounded-lg transition-colors group">
                            <IconEdit size={18} className="text-textPri group-hover:text-primary" />
                            </button>
                            <div className="relative">
                            <button
                                onClick={() =>
                                setActiveDropdown(activeDropdown === product.id ? null : product.id)
                                }
                                className="p-2 hover:bg-bgPri rounded-lg transition-colors"
                            >
                                <IconDotsVertical size={18} className="text-textPri" />
                            </button>
                            {activeDropdown === product.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-bgSec border border-borderPri rounded-lg shadow-lg py-1 z-10">
                                <button className="w-full px-4 py-2 text-left text-textPri hover:bg-bgHoverPri transition-colors flex items-center gap-2">
                                    <IconEdit size={16} />
                                    Edit
                                </button>
                                <button className="w-full px-4 py-2 text-left text-textPri hover:bg-bgHoverPri transition-colors flex items-center gap-2">
                                    <IconEye size={16} />
                                    View Details
                                </button>
                                <div className="border-t border-borderPri my-1"></div>
                                <button className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2">
                                    <IconTrash size={16} />
                                    Delete
                                </button>
                                </div>
                            )}
                            </div>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="py-16 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-textSec mb-2">No products found</h3>
                <p className="text-textPri mb-6">
                    Try adjusting your search or filter criteria
                </p>
                <button
                    onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedStatus('all')
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Clear Filters
                </button>
                </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
                <div className="border-t border-borderPri px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-textPri">
                    Showing <span className="font-medium text-textSec">{filteredProducts.length}</span> of{' '}
                    <span className="font-medium text-textSec">{products.length}</span> products
                </p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 border border-borderPri rounded-lg text-textPri hover:bg-bgHoverPri transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                    </button>
                    <button className="px-3 py-1.5 bg-primary text-white rounded-lg">1</button>
                    <button className="px-3 py-1.5 border border-borderPri rounded-lg text-textPri hover:bg-bgHoverPri transition-colors">
                    2
                    </button>
                    <button className="px-3 py-1.5 border border-borderPri rounded-lg text-textPri hover:bg-bgHoverPri transition-colors">
                    3
                    </button>
                    <button className="px-3 py-1.5 border border-borderPri rounded-lg text-textPri hover:bg-bgHoverPri transition-colors">
                    Next
                    </button>
                </div>
                </div>
            )}
        </div>

        {/* Add product dialog */}
        <ProductDialog 
        isOpen={productDialogOpen} 
        onClose={() => setProductDialogOpen(false)} />
    </>
  )
}