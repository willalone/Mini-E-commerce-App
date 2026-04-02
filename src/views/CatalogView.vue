<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Search } from 'lucide-vue-next'
import { useProductsStore } from '../stores/products'
import ProductCard from '../components/ProductCard.vue'
import PaginationBar from '../components/PaginationBar.vue'
import SkeletonCard from '../components/SkeletonCard.vue'

const store = useProductsStore()

const searchInput = ref('')
let searchTimeout: ReturnType<typeof setTimeout>

watch(searchInput, (val) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => store.setSearch(val), 300)
})

const minPrice = ref(0)
const maxPrice = ref(0)

function applyPrice() {
  store.setPriceRange(minPrice.value, maxPrice.value)
}

onMounted(() => {
  store.loadProducts()
  store.loadCategories()
})
</script>

<template>
  <section>
    <h1 class="title">Каталог</h1>

    <div class="filters">
      <div class="search-box">
        <Search :size="16" class="search-icon" />
        <input v-model="searchInput" type="text" placeholder="Поиск товаров..." />
      </div>

      <select :value="store.selectedCategory" @change="store.setCategory(($event.target as HTMLSelectElement).value)">
        <option value="">Все категории</option>
        <option v-for="cat in store.categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>

      <select v-model="store.sortBy">
        <option value="">Сортировка</option>
        <option value="price-asc">Цена ↑</option>
        <option value="price-desc">Цена ↓</option>
        <option value="name">По названию</option>
      </select>
    </div>

    <div class="price-filter">
      <span>Цена:</span>
      <input v-model.number="minPrice" type="number" placeholder="от" min="0" @change="applyPrice" />
      <span>—</span>
      <input v-model.number="maxPrice" type="number" placeholder="до" min="0" @change="applyPrice" />
    </div>

    <!-- loading skeleton -->
    <div v-if="store.isLoading" class="products-grid">
      <SkeletonCard v-for="n in 8" :key="n" />
    </div>

    <div v-else-if="store.error" class="status">
      <p class="error-text">{{ store.error }}</p>
      <button class="btn-primary" @click="store.loadProducts()">Повторить</button>
    </div>

    <div v-else-if="store.filtered.length === 0" class="status">
      <p>Ничего не найдено</p>
    </div>

    <template v-else>
      <div class="products-grid">
        <ProductCard v-for="p in store.pageItems" :key="p.id" :product="p" />
      </div>
      <PaginationBar :current="store.page" :total="store.totalPages" @change="(p) => store.page = p" />
    </template>
  </section>
</template>

<style scoped>
.title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-box input {
  width: 100%;
  padding: 9px 12px 9px 34px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.88rem;
}

.search-box input:focus {
  outline: none;
  border-color: #2563eb;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
}

.filters select {
  padding: 9px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.84rem;
  color: #555;
  cursor: pointer;
}

.price-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 0.85rem;
  color: #555;
}

.price-filter input {
  width: 90px;
  padding: 7px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.84rem;
}

.price-filter input:focus {
  outline: none;
  border-color: #2563eb;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.status {
  text-align: center;
  padding: 60px 16px;
  color: #999;
}

.error-text {
  color: #ef4444;
  margin-bottom: 12px;
}

.btn-primary {
  padding: 8px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .products-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
}
@media (max-width: 640px) {
  .products-grid { grid-template-columns: 1fr; }
  .filters { flex-direction: column; }
}
</style>
