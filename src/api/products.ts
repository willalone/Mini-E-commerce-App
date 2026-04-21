import axios from 'axios'
import type { Product } from '../types'

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api-dummyjson' : 'https://dummyjson.com',
})

export function getProducts(): Promise<Product[]> {
  return api.get('/products', { params: { limit: 50 } }).then((res) => res.data.products)
}

export function getProduct(id: number): Promise<Product> {
  return api.get(`/products/${id}`).then((res) => res.data)
}

export function getCategories(): Promise<string[]> {
  return api.get('/products/category-list').then((res) => res.data)
}

/** Загружает все товары с dummyjson (несколько запросов по limit/skip). */
export async function getAllProducts(): Promise<Product[]> {
  const pageSize = 100
  const first = await api.get<{ products: Product[]; total: number }>('/products', {
    params: { limit: pageSize, skip: 0 },
  })
  const { total, products } = first.data
  const all: Product[] = [...products]
  let skip = products.length
  while (all.length < total) {
    const res = await api.get<{ products: Product[] }>('/products', {
      params: { limit: pageSize, skip },
    })
    const batch = res.data.products
    if (!batch.length) break
    all.push(...batch)
    skip += batch.length
  }
  return all
}
