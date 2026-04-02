import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getProducts, getCategories } from '../api/products'
import type { Product } from '../types'

export const useProductsStore = defineStore('products', () => {
  const items = ref<Product[]>([])
  const categories = ref<string[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const selectedCategory = ref('')
  const searchQuery = ref('')
  const sortBy = ref('')
  const priceRange = ref<[number, number]>([0, 0])
  const page = ref(1)
  const perPage = 8

  const maxPrice = computed(() => {
    if (!items.value.length) return 1000
    return Math.ceil(Math.max(...items.value.map((p) => p.price)))
  })

  const filtered = computed(() => {
    let list = items.value

    if (selectedCategory.value) {
      list = list.filter((p) => p.category === selectedCategory.value)
    }

    const q = searchQuery.value.trim().toLowerCase()
    if (q) {
      list = list.filter((p) => p.title.toLowerCase().includes(q))
    }

    const [min, max] = priceRange.value
    if (min > 0 || (max > 0 && max < maxPrice.value)) {
      list = list.filter((p) => p.price >= min && p.price <= (max || Infinity))
    }

    if (sortBy.value === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price)
    } else if (sortBy.value === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price)
    } else if (sortBy.value === 'name') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    }

    return list
  })

  const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))

  const pageItems = computed(() => {
    const start = (page.value - 1) * perPage
    return filtered.value.slice(start, start + perPage)
  })

  async function loadProducts() {
    if (items.value.length > 0) return
    isLoading.value = true
    error.value = null
    try {
      items.value = await getProducts()
    } catch (err) {
      error.value = 'Не удалось загрузить товары'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function loadCategories() {
    if (categories.value.length > 0) return
    try {
      categories.value = await getCategories()
    } catch (err) {
      console.error(err)
    }
  }

  function setCategory(val: string) {
    selectedCategory.value = val
    page.value = 1
  }

  function setSearch(val: string) {
    searchQuery.value = val
    page.value = 1
  }

  function setPriceRange(min: number, max: number) {
    priceRange.value = [min, max]
    page.value = 1
  }

  return {
    items, categories, isLoading, error,
    selectedCategory, searchQuery, sortBy, priceRange, maxPrice,
    page, perPage, filtered, totalPages, pageItems,
    loadProducts, loadCategories, setCategory, setSearch, setPriceRange,
  }
})
