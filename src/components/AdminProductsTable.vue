<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useAdminProductsTableStore } from '../stores/adminProductsTable'
import AdminProductsToolbar from './AdminProductsToolbar.vue'
import PaginationBar from './PaginationBar.vue'

const store = useAdminProductsTableStore()
const {
  items,
  isLoading,
  loadError,
  selectedCategory,
  priceMin,
  priceMax,
  categoriesFromData,
  sorted,
  pageRows,
  totalPages,
  page,
} = storeToRefs(store)

onMounted(() => {
  void store.load()
})
</script>

<template>
  <div class="admin-table">
    <div class="admin-table__toolbar">
      <AdminProductsToolbar
        :categories="categoriesFromData"
        :category="selectedCategory"
        :price-min="priceMin"
        :price-max="priceMax"
        :disabled="isLoading || !!loadError"
        @update:category="(v) => (store.selectedCategory = v)"
        @update:price-min="(v) => (store.priceMin = v)"
        @update:price-max="(v) => (store.priceMax = v)"
      />
      <p v-if="!isLoading && !loadError" class="admin-table__meta">
        Показано {{ pageRows.length }} из {{ sorted.length }}
        <template v-if="items.length !== sorted.length"> (всего в базе {{ items.length }})</template>
      </p>
    </div>

    <div v-if="isLoading" class="admin-table__status">Загрузка…</div>
    <div v-else-if="loadError" class="admin-table__status admin-table__status--error">
      {{ loadError }}
      <button type="button" class="admin-table__retry" @click="store.load()">Повторить</button>
    </div>
    <template v-else>
      <div class="admin-table__scroll">
        <table class="admin-table__grid">
          <thead>
            <tr>
              <th class="admin-table__th admin-table__th--narrow">ID</th>
              <th class="admin-table__th admin-table__th--thumb">Фото</th>
              <th class="admin-table__th admin-table__th--sortable" scope="col">
                <button type="button" class="admin-table__sort" @click="store.toggleSort('title')">
                  Название <span class="admin-table__sort-mark">{{ store.sortIndicator('title') }}</span>
                </button>
              </th>
              <th class="admin-table__th">Категория</th>
              <th class="admin-table__th admin-table__th--sortable admin-table__th--num" scope="col">
                <button type="button" class="admin-table__sort" @click="store.toggleSort('price')">
                  Цена <span class="admin-table__sort-mark">{{ store.sortIndicator('price') }}</span>
                </button>
              </th>
              <th class="admin-table__th admin-table__th--sortable admin-table__th--num" scope="col">
                <button type="button" class="admin-table__sort" @click="store.toggleSort('rating')">
                  Рейтинг <span class="admin-table__sort-mark">{{ store.sortIndicator('rating') }}</span>
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

      <PaginationBar :current="page" :total="totalPages" @change="store.setPage" />
    </template>
  </div>
</template>

<style scoped lang="scss">
$border: #e2e8f0;
$header-bg: #0f172a;
$header-fg: #f8fafc;
$row-hover: #f1f5f9;
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
