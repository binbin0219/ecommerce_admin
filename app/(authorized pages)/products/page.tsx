'use client'

import DataTable, { DataTableHeader } from "@/components/Datatable"
import Pagination, { PaginationNewPageCallback } from "@/components/Pagination"
import api from "@/lib/api-agent"
import { useDialogContext } from "@/context/DialogContext"
import { useAppSelector, useUtilsDispatch } from "@/redux/hooks"
import { selectSeller } from "@/redux/slices/sellerSlice"
import { addToast } from "@/redux/slices/toastSlice"
import { useCallback, useRef, useState } from "react"
import ProductDialog, { ProductFormValue } from "./ProductDialog"

interface Product {
  id: string
  name: string
  category: { name: string } | null
  price: number
  stock: number
  status: 'active' | 'draft' | 'out_of_stock' | string
  image: string
}

interface ProductRow extends Product {
  categoryName: string
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  draft: 'Draft',
  out_of_stock: 'Out of stock',
}

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  out_of_stock: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const headers: DataTableHeader<ProductRow>[] = [
  {
    name: 'Image',
    key: 'image',
    render: (value: string) =>
      value ? (
        <img src={value} alt="" className="h-10 w-10 rounded-md object-cover border border-borderPri" />
      ) : (
        <div className="h-10 w-10 rounded-md bg-bgHoverPri" />
      ),
  },
  { name: 'Name', key: 'name' },
  { name: 'Category', key: 'categoryName' },
  { name: 'Price', key: 'price', type: 'currency' },
  {
    name: 'Status',
    key: 'status',
    render: (value: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[value] ?? 'bg-bgHoverPri text-textPri'}`}>
        {STATUS_LABEL[value] ?? value ?? 'Unknown'}
      </span>
    ),
  },
]

export default function ProductsPage() {
  const seller = useAppSelector(selectSeller)
  const dispatch = useUtilsDispatch()
  const confirmDialog = useDialogContext()

  const [products, setProducts] = useState<ProductRow[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add')
  const [selected, setSelected] = useState<ProductFormValue | null>(null)

  const [reloadKey, setReloadKey] = useState(0)
  const lastPage = useRef({ page: 1, pageSize: 5 })

  const reload = useCallback(() => setReloadKey(k => k + 1), [])

  const fetchProducts: PaginationNewPageCallback = useCallback(async (currentPage, pageSize) => {
    lastPage.current = { page: currentPage, pageSize }
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams({
        sellerId: String(seller?.id ?? ''),
        page: String(currentPage),
        pageSize: String(pageSize),
      })
      const response = await api.get(`/products?${query.toString()}`)
      const rows: ProductRow[] = (response.data.items ?? []).map((p: Product) => ({
        ...p,
        categoryName: p.category?.name ?? 'Uncategorized',
      }))
      setProducts(rows)
      setTotalItems(response.data.totalItems ?? 0)
    } catch (err) {
      console.error(err)
      setError('Could not load products. Is the API running?')
      setProducts([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [seller?.id])

  const handleAdd = () => {
    setDialogMode('add')
    setSelected(null)
    setDialogOpen(true)
  }

  const handleEdit = (product: ProductRow) => {
    setDialogMode('edit')
    setSelected({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.categoryName,
      image: product.image ?? '',
    })
    setDialogOpen(true)
  }

  const handleDelete = (product: ProductRow) => {
    confirmDialog.open(
      'Delete product',
      `Delete "${product.name}"? This cannot be undone.`,
      'Delete',
      async () => {
        try {
          await api.delete(`/products/${product.id}`)
          dispatch(addToast({ message: 'Product deleted', type: 'success' }))
          reload()
        } catch (err) {
          console.error(err)
          dispatch(addToast({ message: 'Failed to delete product', type: 'error' }))
        } finally {
          confirmDialog.close()
        }
      }
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold text-textSec">Products</h1>
        <button onClick={handleAdd} className="px-4 py-2 rounded-md bg-appPrimary text-white text-sm">
          Add product
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
        <Pagination totalItems={totalItems} reloadKey={reloadKey} onNewPage={fetchProducts}>
          <DataTable<ProductRow>
            items={products}
            headers={headers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Pagination>
      </div>

      <ProductDialog
        isOpen={dialogOpen}
        mode={dialogMode}
        product={selected}
        onClose={() => setDialogOpen(false)}
        onSaved={reload}
      />
    </div>
  )
}
