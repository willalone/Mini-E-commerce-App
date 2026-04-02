import axios from 'axios'
import type { Product } from '../types'

const api = axios.create({
  baseURL: 'https://dummyjson.com',
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
