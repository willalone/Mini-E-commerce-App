<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { getAllProducts } from '../api/products'
import type { Product } from '../types'
import PaginationBar from './PaginationBar.vue'

type SortKey = 'title' | 'price' | 'rating'

const products = ref<Product[]>([])
const isLoading = ref(true)
const loadError = ref<string | null>(null)

const selectedCategory = ref('')
const sortKey = ref<SortKey>('title')
const sortAsc = ref(true)
const page = ref(1)
const perPage = 10

const categoriesFromData = computed(() => {
  const set = new Set(products.value.map((p) => p.category))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const filtered = computed(() => {
  if (!selectedCategory.value) return products.value
  return products.value.filter((p) => p.category === selectedCategory.value)
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

watch([selectedCategory, sortKey, sortAsc], () => {
  page.value = 1
})

watch(sorted, () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function sortIndicator(key: SortKey) {
  if (sortKey.value !== key) return ''
  return sortAsc.value ? '↑' : '↓'
}

async function load() {
  isLoading.value = true
  loadError.value = null
  try {
    products.value = await getAllProducts()
  } catch (e) {
    loadError.value = 'Не удалось загрузить товары'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="admin-table">
    <div class="admin-table__toolbar">
      <label class="admin-table__filter">
        <span>Категория</span>
        <select v-model="selectedCategory" class="admin-table__select">
          <option value="">Все</option>
          <option v-for="c in categoriesFromData" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
      <p v-if="!isLoading && !loadError" class="admin-table__meta">
        Показано {{ pageRows.length }} из {{ sorted.length }}
        <template v-if="products.length !== sorted.length"> (всего в базе {{ products.length }})</template>
      </p>
    </div>

    <div v-if="isLoading" class="admin-table__status">Загрузка…</div>
    <div v-else-if="loadError" class="admin-table__status admin-table__status--error">
      {{ loadError }}
      <button type="button" class="admin-table__retry" @click="load">Повторить</button>
    </div>
    <template v-else>
      <div class="admin-table__scroll">
        <table class="admin-table__grid">
          <thead>
            <tr>
              <th class="admin-table__th admin-table__th--narrow">ID</th>
              <th class="admin-table__th admin-table__th--thumb">Фото</th>
              <th class="admin-table__th admin-table__th--sortable" scope="col">
                <button type="button" class="admin-table__sort" @click="toggleSort('title')">
                  Название <span class="admin-table__sort-mark">{{ sortIndicator('title') }}</span>
                </button>
              </th>
              <th class="admin-table__th">Категория</th>
              <th class="admin-table__th admin-table__th--sortable admin-table__th--num" scope="col">
                <button type="button" class="admin-table__sort" @click="toggleSort('price')">
                  Цена <span class="admin-table__sort-mark">{{ sortIndicator('price') }}</span>
                </button>
              </th>
              <th class="admin-table__th admin-table__th--sortable admin-table__th--num" scope="col">
                <button type="button" class="admin-table__sort" @click="toggleSort('rating')">
                  Рейтинг <span class="admin-table__sort-mark">{{ sortIndicator('rating') }}</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in pageRows" :key="p.id" class="admin-table__row">
              <td class="admin-table__td admin-table__td--muted">{{ p.id }}</td>
              <td class="admin-table__td">
                <img :src="p.thumbnail" :alt="p.title" class="admin-table__thumb" width="48" height="48" />
              </td>
              <td class="admin-table__td admin-table__td--title">{{ p.title }}</td>
              <td class="admin-table__td">
                <span class="admin-table__chip">{{ p.category }}</span>
              </td>
              <td class="admin-table__td admin-table__td--num">{{ p.price.toFixed(2) }} $</td>
              <td class="admin-table__td admin-table__td--num">{{ p.rating.toFixed(1) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <PaginationBar :current="page" :total="totalPages" @change="(p) => (page = p)" />
    </template>
  </div>
</template>

<style scoped lang="scss">
$border: #e2e8f0;
$header-bg: #0f172a;
$header-fg: #f8fafc;
$row-hover: #f1f5f9;
$accent: #2563eb;
$muted: #64748b;

.admin-table {
  background: #fff;
  border-radius: 12px;
  border: 1px solid $border;
  box-shadow: 0 1px 3px rgb(15 23 42 / 6%);
  padding: 20px;
}

.admin-table__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.admin-table__filter {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: $muted;
}

.admin-table__select {
  min-width: 200px;
  padding: 8px 10px;
  border: 1px solid $border;
  border-radius: 8px;
  background: #fff;

    &:focus {
      outline: 2px solid rgba(37, 99, 235, 0.35);
      border-color: $accent;
    }
}

.admin-table__meta {
  font-size: 0.85rem;
  color: $muted;
  margin: 0;
}

.admin-table__status {
  padding: 48px 16px;
  text-align: center;
  color: $muted;

  &--error {
    color: #b91c1c;
  }
}

.admin-table__retry {
  margin-left: 12px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid $border;
  background: #fff;
  cursor: pointer;

  &:hover {
    background: $row-hover;
  }
}

.admin-table__scroll {
  overflow-x: auto;
  margin: 0 -4px;
  padding: 0 4px;
}

.admin-table__grid {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.admin-table__th {
  text-align: left;
  padding: 12px 10px;
  background: $header-bg;
  color: $header-fg;
  font-weight: 600;
  white-space: nowrap;
  border-bottom: 2px solid rgb(255 255 255 / 0.08);

  &--narrow {
    width: 56px;
  }

  &--thumb {
    width: 64px;
  }

  &--num {
    text-align: right;
  }
}

.admin-table__sort {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover .admin-table__sort-mark {
    opacity: 1;
  }
}

.admin-table__sort-mark {
  font-size: 0.75rem;
  opacity: 0.85;
}

.admin-table__row {
  border-bottom: 1px solid $border;

  &:hover {
    background: $row-hover;
  }

  &:last-child {
    border-bottom: 0;
  }
}

.admin-table__td {
  padding: 10px;
  vertical-align: middle;

  &--muted {
    color: $muted;
    font-variant-numeric: tabular-nums;
  }

  &--title {
    font-weight: 500;
    max-width: 320px;
  }

  &--num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
}

.admin-table__thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid $border;
}

.admin-table__chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1e40af;
  font-size: 0.78rem;
  font-weight: 500;
  text-transform: capitalize;
}
</style>
