import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from '../stores/products'
import type { Product } from '../types'

const testProducts: Product[] = [
  { id: 1, title: 'Alpha Shirt', price: 20, category: 'clothing', description: '', rating: 4, thumbnail: '' },
  { id: 2, title: 'Beta Jacket', price: 50, category: 'clothing', description: '', rating: 3, thumbnail: '' },
  { id: 3, title: 'Gamma Ring', price: 100, category: 'jewelery', description: '', rating: 5, thumbnail: '' },
]

describe('Products Store', () => {
  let store: ReturnType<typeof useProductsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useProductsStore()
    store.items = testProducts
  })

  it('фильтрует по категории', () => {
    store.setCategory('clothing')
    expect(store.filtered).toHaveLength(2)
  })

  it('фильтрует по поисковому запросу', () => {
    store.setSearch('gamma')
    expect(store.filtered).toHaveLength(1)
    expect(store.filtered[0].title).toBe('Gamma Ring')
  })

  it('фильтрует по ценовому диапазону', () => {
    store.setPriceRange(30, 100)
    expect(store.filtered).toHaveLength(2)
  })
})
