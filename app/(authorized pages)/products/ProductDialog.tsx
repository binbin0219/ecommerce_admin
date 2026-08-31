'use client'

import Dialog from "@/components/Dialog"
import api from "@/lib/api-agent"
import { useAppSelector } from "@/redux/hooks"
import { useUtilsDispatch } from "@/redux/hooks"
import { selectSeller } from "@/redux/slices/sellerSlice"
import { addToast } from "@/redux/slices/toastSlice"
import { useEffect, useState } from "react"

export type ProductFormValue = {
  id?: string
  name: string
  price: number
  category: string
  image: string
}

type Props = {
  isOpen: boolean
  mode: 'add' | 'edit'
  product?: ProductFormValue | null
  onClose: () => void
  onSaved: () => void
}

const emptyForm: ProductFormValue = { name: '', price: 0, category: '', image: '' }

export default function ProductDialog({ isOpen, mode, product, onClose, onSaved }: Props) {
  const seller = useAppSelector(selectSeller)
  const dispatch = useUtilsDispatch()
  const [form, setForm] = useState<ProductFormValue>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm(mode === 'edit' && product ? { ...product } : emptyForm)
    }
  }, [isOpen, mode, product])

  const set = <K extends keyof ProductFormValue>(key: K, value: ProductFormValue[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const canSubmit = form.name.trim() !== '' && form.category.trim() !== '' && form.price >= 0

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    try {
      const payload = {
        sellerId: seller?.id,
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        image: form.image.trim(),
      }

      if (mode === 'edit' && product?.id) {
        await api.put(`/products/${product.id}`, payload)
      } else {
        await api.post(`/products`, payload)
      }

      dispatch(addToast({
        message: mode === 'edit' ? 'Product updated' : 'Product created',
        type: 'success',
      }))
      onSaved()
      onClose()
    } catch (error) {
      console.error(error)
      dispatch(addToast({ message: 'Failed to save product', type: 'error' }))
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    "w-full px-3 py-2 bg-bgPri border-2 border-borderPri rounded-lg text-textSec outline-none focus:border-appPrimary transition-colors"

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 w-[400px] max-w-full">
        <p className="text-lg font-semibold text-textSec">
          {mode === 'edit' ? 'Edit Product' : 'Add Product'}
        </p>

        <label className="flex flex-col gap-1 text-sm text-textPri">
          Image URL
          <input
            className={inputClass}
            value={form.image}
            onChange={e => set('image', e.target.value)}
            placeholder="https://…"
          />
        </label>

        {form.image.trim() !== '' && (
          <img
            src={form.image}
            alt="preview"
            className="h-24 w-24 rounded-lg object-cover border border-borderPri"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}

        <label className="flex flex-col gap-1 text-sm text-textPri">
          Name <span className="text-red-500">*</span>
          <input
            className={inputClass}
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-textPri">
          Price <span className="text-red-500">*</span>
          <input
            type="number"
            min={0}
            step="0.01"
            className={inputClass}
            value={form.price}
            onChange={e => set('price', e.target.valueAsNumber || 0)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-textPri">
          Category <span className="text-red-500">*</span>
          <input
            className={inputClass}
            value={form.category}
            onChange={e => set('category', e.target.value)}
          />
        </label>

        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-borderPri text-sm hover:bg-bgHoverPri transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="px-4 py-2 rounded-md bg-appPrimary text-white text-sm disabled:opacity-50 transition-opacity"
          >
            {submitting ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create product'}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
