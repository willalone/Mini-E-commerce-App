import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getAllProducts } from '../api/products'
import type { Product } from '../types'

export type AdminSortKey = 'title' | 'price' | 'rating'

export const useAdminProductsTableStore = defineStore('adminProductsTable', () => {
  const items = ref<Product[]>([])
  const isLoading = ref(false)
  const loadError = ref<string | null>(null)

  const selectedCategory = ref('')
  /** 0 — без нижней границы. */
  const priceMin = ref(0)
  /** 0 — без верхней границы. */
  const priceMax = ref(0)
  const sortKey = ref<AdminSortKey>('title')
  const sortAsc = ref(true)
  const page = ref(1)
  const perPage = 10

  const categoriesFromData = computed(() => {
    const set = new Set(items.value.map((p) => p.category))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  })

  const filtered = computed(() => {
    let list = items.value
    if (selectedCategory.value) {
      list = list.filter((p) => p.category === selectedCategory.value)
    }
    if (priceMin.value > 0) {
      list = list.filter((p) => p.price >= priceMin.value)
    }
    if (priceMax.value > 0) {
      list = list.filter((p) => p.price <= priceMax.value)
    }
    return list
  })

  const sorted = computed(() => {
    const list = [...filtered.value]
    const dir = sortAsc.value ? 1 : -1
    const key = sortKey.value
    list.sort((a, b) => {
      if (key === 'title') return dir * a.title.localeCompare(b.title, 'ru')
      if (key === 'price') return dir * (a.price - b.price)
      return dir * (a.rating - b.rating)
    })
    return list
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(sorted.value.length / perPage)))

  const pageRows = computed(() => {
    const start = (page.value - 1) * perPage
    return sorted.value.slice(start, start + perPage)
  })

  watch(
    selectedCategory,
    () => {
      page.value = 1
    },
    { flush: 'sync' },
  )
  watch(
    sortKey,
    () => {
      page.value = 1
    },
    { flush: 'sync' },
  )
  watch(
    sortAsc,
    () => {
      page.value = 1
    },
    { flush: 'sync' },
  )
  watch(
    priceMin,
    () => {
      page.value = 1
    },
    { flush: 'sync' },
  )
  watch(
    priceMax,
    () => {
      page.value = 1
    },
    { flush: 'sync' },
  )

  watch(
    sorted,
    () => {
      if (page.value > totalPages.value) page.value = totalPages.value
    },
    { flush: 'sync' },
  )

  function toggleSort(key: AdminSortKey) {
    if (sortKey.value === key) {
      sortAsc.value = !sortAsc.value
    } else {
      sortKey.value = key
      sortAsc.value = true
    }
  }

  function sortIndicator(key: AdminSortKey) {
    if (sortKey.value !== key) return ''
    return sortAsc.value ? '↑' : '↓'
  }

  async function load() {
    isLoading.value = true
    loadError.value = null
    try {
      items.value = await getAllProducts()
    } catch (e) {
      loadError.value = 'Не удалось загрузить товары'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  function setPage(p: number) {
    page.value = p
  }

  return {
    items,
    isLoading,
    loadError,
    selectedCategory,
    priceMin,
    priceMax,
    sortKey,
    sortAsc,
    page,
    perPage,
    categoriesFromData,
    filtered,
    sorted,
    totalPages,
    pageRows,
    toggleSort,
    sortIndicator,
    load,
    setPage,
  }
})
