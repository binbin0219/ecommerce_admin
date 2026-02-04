'use client'

import DataTable from "@/components/Datatable"
import { PaginationNewPageCallback } from "@/components/Pagination"
import api from "@/lib/api-agent"
import { useState } from "react"

interface Product {
  id: string
  name: string
  sku: string
  category: any
  price: number
  stock: number
  status: 'active' | 'draft' | 'out_of_stock'
  image: string
  sales: number
  createdAt: string
}

const headers = [
    { name: 'Name', key: 'name'},
    // { name: 'Sku', key: 'sku'},
    { name: 'Category', key: 'categoryName'},
    // { name: 'Price', key: 'price'},
    // { name: 'Stock', key: 'stock'},
    { name: 'Status', key: 'status'},
]

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const fetchProducts : PaginationNewPageCallback = async (currentPage: number, pageSize: number) => {
    try {
      const query = new URLSearchParams({
        sellerId: '1',
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await api.get(`/products?${query.toString()}`);
      const products = (response.data.items || [] as Product[]).map((p: Product) => {
        return {
          ...p,
          categoryName: p.category?.name || 'Unknown',
          status: 'Unknown',
        }
      });
      const totalItems = response.data.totalItems || 0;
      setFilteredProducts(products)
      setTotalItems(totalItems);
    } catch (error) {
      console.error(error);
    }
  }

  const handleEdit = async (product: Product) => {
    
  }

  return (
      <div>
          <DataTable<Product> 
          items={filteredProducts} 
          headers={headers} 
          totalItems={totalItems}
          onNewPage={fetchProducts}
          onEdit={handleEdit} />
      </div>
  )
}