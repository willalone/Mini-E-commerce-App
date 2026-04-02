import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product, CartItem } from '../types'

function loadCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]')
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadCart())

  // сохраняем в localStorage при каждом изменении
  watch(items, (val) => {
    localStorage.setItem('cart', JSON.stringify(val))
  }, { deep: true })

  const count = computed(() => items.value.reduce((acc, i) => acc + i.qty, 0))
  const total = computed(() => items.value.reduce((acc, i) => acc + i.price * i.qty, 0))

  function add(product: Product | CartItem) {
    const existing = items.value.find((i) => i.id === product.id)
    if (existing) {
      existing.qty++
      return
    }
    items.value.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: ('thumbnail' in product ? product.thumbnail : (product as CartItem).image) || '',
      qty: 1,
    })
  }

  function remove(id: number) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function setQty(id: number, qty: number) {
    if (qty <= 0) return remove(id)
    const item = items.value.find((i) => i.id === id)
    if (item) item.qty = qty
  }

  function has(id: number) {
    return items.value.some((i) => i.id === id)
  }

  function clear() {
    items.value = []
  }

  return { items, count, total, add, remove, setQty, has, clear }
})
