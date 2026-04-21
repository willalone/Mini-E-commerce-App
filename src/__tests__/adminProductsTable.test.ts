import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import * as productsApi from '../api/products'
import { useAdminProductsTableStore } from '../stores/adminProductsTable'
import type { Product } from '../types'

const sample: Product[] = [
  { id: 1, title: 'Beta', price: 30, category: 'electronics', description: '', rating: 4, thumbnail: '' },
  { id: 2, title: 'Alpha', price: 10, category: 'electronics', description: '', rating: 5, thumbnail: '' },
  { id: 3, title: 'Gamma', price: 20, category: 'beauty', description: '', rating: 3, thumbnail: '' },
]

describe('adminProductsTable store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.spyOn(productsApi, 'getAllProducts').mockResolvedValue(sample)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('загружает товары', async () => {
    const store = useAdminProductsTableStore()
    await store.load()
    expect(store.items).toHaveLength(3)
    expect(productsApi.getAllProducts).toHaveBeenCalledOnce()
  })

  it('фильтрует по категории и сбрасывает страницу', async () => {
    const store = useAdminProductsTableStore()
    await store.load()
    store.setPage(2)
    store.selectedCategory = 'beauty'
    expect(store.filtered).toHaveLength(1)
    expect(store.page).toBe(1)
  })

  it('сортирует по цене по клику', async () => {
    const store = useAdminProductsTableStore()
    await store.load()
    store.toggleSort('price')
    expect(store.sorted.map((p) => p.id)).toEqual([2, 3, 1])
    store.toggleSort('price')
    expect(store.sorted.map((p) => p.id)).toEqual([1, 3, 2])
  })

  it('фильтрует по диапазону цены', async () => {
    const store = useAdminProductsTableStore()
    await store.load()
    store.priceMin = 15
    store.priceMax = 25
    expect(store.filtered.map((p) => p.id)).toEqual([3])
  })
})
