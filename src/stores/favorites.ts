import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const STORAGE_KEY = 'favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<number[]>(loadIds())
  const count = computed(() => ids.value.length)

  function loadIds(): number[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.value))
  }

  function toggle(id: number) {
    const idx = ids.value.indexOf(id)
    if (idx === -1) {
      ids.value.push(id)
    } else {
      ids.value.splice(idx, 1)
    }
    save()
  }

  function has(id: number) {
    return ids.value.includes(id)
  }

  return { ids, count, toggle, has }
})
