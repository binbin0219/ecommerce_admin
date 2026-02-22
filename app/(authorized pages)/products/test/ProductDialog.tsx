'use client'

import { useState } from 'react'
import Dialog from "@/components/Dialog"
import {
  IconX,
  IconPhoto,
  IconUpload,
  IconTrash,
  IconPlus,
  IconGripVertical,
  IconAlertCircle,
  IconCheck,
} from '@tabler/icons-react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

interface ProductOption {
  id: string
  name: string
  values: string[]
}

interface ProductVariant {
  id: string
  combination: Record<string, string>
  sku: string
  price: number
  stock: number
  image?: string
}

export default function ProductDialog(props: Props) {
  // Basic Info
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  
  // Images
  const [images, setImages] = useState<string[]>([])
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0)
  
  // Price & Stock
  const [basePrice, setBasePrice] = useState('')
  const [comparePrice, setComparePrice] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [sku, setSku] = useState('')
  const [barcode, setBarcode] = useState('')
  const [stock, setStock] = useState('')
  const [lowStockThreshold, setLowStockThreshold] = useState('10')
  
  // Options
  const [options, setOptions] = useState<ProductOption[]>([])
  const [newOptionName, setNewOptionName] = useState('')
  const [newOptionValue, setNewOptionValue] = useState('')
  
  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [hasVariants, setHasVariants] = useState(false)
  
  // Additional Settings
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [status, setStatus] = useState<'draft' | 'active'>('draft')
  const [trackInventory, setTrackInventory] = useState(true)
  const [allowBackorder, setAllowBackorder] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)

  const categories = ['Electronics', 'Accessories', 'Clothing', 'Home & Garden', 'Sports', 'Books']

  // Image handling
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    if (primaryImageIndex >= newImages.length) {
      setPrimaryImageIndex(Math.max(0, newImages.length - 1))
    }
  }

  // Options handling
  const addOption = () => {
    if (newOptionName.trim()) {
      const newOption: ProductOption = {
        id: Date.now().toString(),
        name: newOptionName,
        values: [],
      }
      setOptions([...options, newOption])
      setNewOptionName('')
    }
  }

  const addOptionValue = (optionId: string) => {
    if (newOptionValue.trim()) {
      setOptions(options.map(opt => 
        opt.id === optionId 
          ? { ...opt, values: [...opt.values, newOptionValue] }
          : opt
      ))
      setNewOptionValue('')
    }
  }

  const removeOption = (optionId: string) => {
    setOptions(options.filter(opt => opt.id !== optionId))
    generateVariants(options.filter(opt => opt.id !== optionId))
  }

  const removeOptionValue = (optionId: string, valueIndex: number) => {
    const updatedOptions = options.map(opt => 
      opt.id === optionId 
        ? { ...opt, values: opt.values.filter((_, i) => i !== valueIndex) }
        : opt
    )
    setOptions(updatedOptions)
    generateVariants(updatedOptions)
  }

  // Generate variants from options
  const generateVariants = (opts = options) => {
    if (opts.length === 0 || !opts.every(opt => opt.values.length > 0)) {
      setVariants([])
      return
    }

    const combinations: Record<string, string>[] = []
    
    const generate = (index: number, current: Record<string, string>) => {
      if (index === opts.length) {
        combinations.push({ ...current })
        return
      }
      
      const option = opts[index]
      option.values.forEach(value => {
        current[option.name] = value
        generate(index + 1, current)
      })
    }
    
    generate(0, {})
    
    const newVariants: ProductVariant[] = combinations.map((combo, idx) => {
      const existing = variants.find(v => 
        Object.keys(combo).every(key => v.combination[key] === combo[key])
      )
      
      if (existing) return existing
      
      return {
        id: Date.now().toString() + idx,
        combination: combo,
        sku: `${sku || 'SKU'}-${idx + 1}`,
        price: parseFloat(basePrice) || 0,
        stock: 0,
      }
    })
    
    setVariants(newVariants)
  }

  const updateVariant = (variantId: string, field: keyof ProductVariant, value: any) => {
    setVariants(variants.map(v => 
      v.id === variantId ? { ...v, [field]: value } : v
    ))
  }

  // Tags handling
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagIndex: number) => {
    setTags(tags.filter((_, i) => i !== tagIndex))
  }

  const handleSubmit = () => {
    const product = {
      name: productName,
      description,
      category,
      images,
      primaryImage: images[primaryImageIndex],
      basePrice: parseFloat(basePrice),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      costPrice: costPrice ? parseFloat(costPrice) : null,
      sku,
      barcode,
      stock: hasVariants ? null : parseInt(stock),
      lowStockThreshold: parseInt(lowStockThreshold),
      hasVariants,
      options: hasVariants ? options : [],
      variants: hasVariants ? variants : [],
      tags,
      status,
      trackInventory,
      allowBackorder,
      isFeatured,
    }
    
    console.log('Product to save:', product)
    props.onClose()
    resetForm()
  }

  const resetForm = () => {
    setProductName('')
    setDescription('')
    setCategory('')
    setImages([])
    setBasePrice('')
    setComparePrice('')
    setCostPrice('')
    setSku('')
    setBarcode('')
    setStock('')
    setOptions([])
    setVariants([])
    setHasVariants(false)
    setTags([])
    setStatus('draft')
  }

  const isValid = productName.trim() !== '' && category !== '' && basePrice !== ''

  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose}>
      <div className="w-full max-w-6xl max-h-[90vh] bg-bgSec rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-borderPri bg-bgPri flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-textSec">Add New Product</h2>
            <p className="text-sm text-textPri mt-1">Fill in the product information below</p>
          </div>
          <button
            onClick={props.onClose}
            className="p-2 hover:bg-bgHoverPri rounded-lg transition-colors"
          >
            <IconX size={24} className="text-textPri" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h3 className="text-xl font-bold text-textSec">Basic Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-textSec mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                    className="w-full px-4 py-3 bg-bgPri border border-borderPri rounded-lg text-textSec placeholder:text-textPri focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-textSec mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product..."
                    rows={4}
                    className="w-full px-4 py-3 bg-bgPri border border-borderPri rounded-lg text-textSec placeholder:text-textPri focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-textSec mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-bgPri border border-borderPri rounded-lg text-textSec focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Images */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h3 className="text-xl font-bold text-textSec">Product Images</h3>
              </div>

              <label className="block border-2 border-dashed border-borderPri rounded-lg p-8 text-center cursor-pointer hover:bg-bgHoverPri transition-colors mb-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <IconUpload size={48} className="mx-auto text-textPri mb-4" />
                <p className="text-textSec font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-textPri">
                  PNG, JPG, GIF up to 10MB
                </p>
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                        primaryImageIndex === index
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-borderPri'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {primaryImageIndex === index && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Primary
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {primaryImageIndex !== index && (
                          <button
                            onClick={() => setPrimaryImageIndex(index)}
                            className="p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                            title="Set as primary"
                          >
                            <IconPhoto size={16} className="text-white" />
                          </button>
                        )}
                        <button
                          onClick={() => removeImage(index)}
                          className="p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                        >
                          <IconTrash size={16} className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Pricing & Inventory */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h3 className="text-xl font-bold text-textSec">Pricing & Inventory</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-textSec mb-2">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textPri">
                        $
                      </span>
                      <input
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 bg-bgPri border border-borderPri rounded-lg text-textSec placeholder:text-textPri focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-textSec mb-2">
                      Compare at Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textPri">
                        $
                      </span>
                      <input
                        type="number"
                        value={comparePrice}
                        onChange={(e) => setComparePrice(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 bg-bgPri border border-borderPri rounded-lg text-textSec placeholder:text-textPri focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-textSec mb-2">
                      Cost per Item
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textPri">
                        $
                      </span>
                      <input
                        type="number"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 bg-bgPri border border-borderPri rounded-lg text-textSec placeholder:text-textPri focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>

                {comparePrice && parseFloat(comparePrice) > parseFloat(basePrice) && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <IconCheck size={18} className="text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Customers will save{' '}
                      <span className="font-semibold">
                        ${(parseFloat(comparePrice) - parseFloat(basePrice)).toFixed(2)} (
                        {((1 - parseFloat(basePrice) / parseFloat(comparePrice)) * 100).toFixed(0)}
                        %)
                      </span>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-textSec mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="SKU-001"
                      className="w-full px-4 py-3 bg-bgPri border border-borderPri rounded-lg text-textSec placeholder:text-textPri focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-textSec mb-2">
                      Barcode
                    </label>
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="123456789"
                      className="w-full px-4 py-3 bg-bgPri border border-borderPri rounded-lg text-textSec placeholder:text-textPri focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                {!hasVariants && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-textSec mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 bg-bgPri border border-borderPri rounded-lg text-textSec placeholder:text-textPri focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-textSec mb-2">
                        Low Stock Threshold
                      </label>
                      <input
                        type="number"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                        placeholder="10"
                        className="w-full px-4 py-3 bg-bgPri border border-borderPri rounded-lg text-textSec placeholder:text-textPri focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Product Variants */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h3 className="text-xl font-bold text-textSec">Product Variants</h3>
              </div>

              <div className="flex items-center justify-between p-4 bg-bgPri rounded-lg border border-borderPri mb-4">
                <div>
                  <h4 className="font-semibold text-textSec">This product has options</h4>
                  <p className="text-sm text-textPri">
                    Like size, color, or material
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasVariants}
                    onChange={(e) => setHasVariants(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-borderPri peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-borderPri after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {hasVariants && (
                <div className="space-y-4">
                  {/* Options */}
                  {options.map((option) => (
                    <div
                      key={option.id}
                      className="p-4 bg-bgPri rounded-lg border border-borderPri"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <IconGripVertical size={18} className="text-textPri" />
                          <h4 className="font-semibold text-textSec">
                            {option.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeOption(option.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <IconTrash size={18} className="text-red-500" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {option.values.map((value, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 px-3 py-1.5 bg-bgSec border border-borderPri rounded-lg"
                          >
                            <span className="text-sm text-textSec">{value}</span>
                            <button
                              onClick={() => removeOptionValue(option.id, index)}
                              className="ml-1 hover:text-red-500 transition-colors"
                            >
                              <IconX size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newOptionValue}
                          onChange={(e) => setNewOptionValue(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addOptionValue(option.id)
                            }
                          }}
                          placeholder={`Add ${option.name.toLowerCase()} value`}
                          className="flex-1 px-3 py-2 bg-bgSec border border-borderPri rounded-lg text-textSec placeholder:text-textPri focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                          onClick={() => addOptionValue(option.id)}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Option */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newOptionName}
                      onChange={(e) => setNewOptionName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addOption()
                        }
                      }}
                      placeholder="Option name (e.g., Size, Color)"
                      className="flex-1 px-4 py-3 bg-bgPri border border-borderPri rounded-lg text-textSec placeholder:text-textPri focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      onClick={addOption}
                      className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <IconPlus size={18} />
                      Add Option
                    </button>
                  </div>

                  {/* Generate Variants Button */}
                  {options.length > 0 && options.every(opt => opt.values.length > 0) && (
                    <button
                      onClick={() => generateVariants()}
                      className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                    >
                      Generate Variants ({options.reduce((acc, opt) => acc * opt.values.length, 1)})
                    </button>
                  )}

                  {/* Variants List */}
                  {variants.length > 0 && (
                    <div className="space-y-3 mt-4">
                      <h4 className="font-semibold text-textSec">
                        Variants ({variants.length})
                      </h4>
                      {variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="p-4 bg-bgPri rounded-lg border border-borderPri"
                        >
                          <h5 className="font-semibold text-textSec mb-3">
                            {Object.values(variant.combination).join(' / ')}
                          </h5>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-textPri mb-1">
                                SKU
                              </label>
                              <input
                                type="text"
                                value={variant.sku}
                                onChange={(e) =>
                                  updateVariant(variant.id, 'sku', e.target.value)
                                }
                                className="w-full px-3 py-2 bg-bgSec border border-borderPri rounded-lg text-textSec text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-textPri mb-1">
                                Price
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textPri text-sm">
                                  $
                                </span>
                                <input
                                  type="number"
                                  value={variant.price}
                                  onChange={(e) =>
                                    updateVariant(variant.id, 'price', parseFloat(e.target.value))
                                  }
                                  step="0.01"
                                  className="w-full pl-7 pr-3 py-2 bg-bgSec border border-borderPri rounded-lg text-textSec text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-textPri mb-1">
                                Stock
                              </label>
                              <input
                                type="number"
                                value={variant.stock}
                                onChange={(e) =>
                                  updateVariant(variant.id, 'stock', parseInt(e.target.value))
                                }
                                className="w-full px-3 py-2 bg-bgSec border border-borderPri rounded-lg text-textSec text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Additional Settings */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h3 className="text-xl font-bold text-textSec">Additional Settings</h3>
              </div>

              <div className="space-y-4">
                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-textSec mb-2">
                    Product Tags
                  </label>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg"
                      >
                        <span className="text-sm text-primary font-medium">{tag}</span>
                        <button
                          onClick={() => removeTag(index)}
                          className="ml-1 hover:text-red-500 transition-colors"
                        >
                          <IconX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTag()
                        }
                      }}
                      placeholder="Add a tag"
                      className="flex-1 px-4 py-3 bg-bgPri border border-borderPri rounded-lg text-textSec placeholder:text-textPri focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-textSec mb-2">
                    Product Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStatus('draft')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        status === 'draft'
                          ? 'border-primary bg-primary/10'
                          : 'border-borderPri hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconAlertCircle size={20} className={status === 'draft' ? 'text-primary' : 'text-textPri'} />
                        <span className={`font-semibold ${status === 'draft' ? 'text-primary' : 'text-textSec'}`}>
                          Draft
                        </span>
                      </div>
                      <p className="text-sm text-textPri text-left">
                        Not visible to customers
                      </p>
                    </button>

                    <button
                      onClick={() => setStatus('active')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        status === 'active'
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-borderPri hover:border-green-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconCheck size={20} className={status === 'active' ? 'text-green-500' : 'text-textPri'} />
                        <span className={`font-semibold ${status === 'active' ? 'text-green-500' : 'text-textSec'}`}>
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-textPri text-left">
                        Published and visible
                      </p>
                    </button>
                  </div>
                </div>

                {/* Settings Toggles */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-bgPri rounded-lg border border-borderPri cursor-pointer hover:bg-bgHoverPri transition-colors">
                    <div>
                      <p className="font-medium text-textSec">Track Inventory</p>
                      <p className="text-sm text-textPri">
                        Monitor stock levels for this product
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={trackInventory}
                      onChange={(e) => setTrackInventory(e.target.checked)}
                      className="w-5 h-5 text-primary rounded border-borderPri focus:ring-2 focus:ring-primary/50"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-bgPri rounded-lg border border-borderPri cursor-pointer hover:bg-bgHoverPri transition-colors">
                    <div>
                      <p className="font-medium text-textSec">Allow Backorders</p>
                      <p className="text-sm text-textPri">
                        Let customers order when out of stock
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowBackorder}
                      onChange={(e) => setAllowBackorder(e.target.checked)}
                      className="w-5 h-5 text-primary rounded border-borderPri focus:ring-2 focus:ring-primary/50"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-bgPri rounded-lg border border-borderPri cursor-pointer hover:bg-bgHoverPri transition-colors">
                    <div>
                      <p className="font-medium text-textSec">Featured Product</p>
                      <p className="text-sm text-textPri">
                        Show on homepage and featured collections
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-5 h-5 text-primary rounded border-borderPri focus:ring-2 focus:ring-primary/50"
                    />
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-borderPri bg-bgPri flex items-center justify-between sticky bottom-0">
          <button
            onClick={props.onClose}
            className="px-6 py-2.5 border border-borderPri rounded-lg text-textPri hover:bg-bgHoverPri transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            <IconCheck size={18} />
            Create Product
          </button>
        </div>
      </div>
    </Dialog>
  )
}