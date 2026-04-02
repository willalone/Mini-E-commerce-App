<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Star, ShoppingCart, Heart } from 'lucide-vue-next'
import { getProduct } from '../api/products'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useFavoritesStore } from '../stores/favorites'
import { useToastStore } from '../stores/toast'
import type { Product } from '../types'

const route = useRoute()
const router = useRouter()
const products = useProductsStore()
const cart = useCartStore()
const fav = useFavoritesStore()
const toast = useToastStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const inCart = computed(() => product.value ? cart.has(product.value.id) : false)
const inFav = computed(() => product.value ? fav.has(product.value.id) : false)

onMounted(async () => {
  const id = Number(route.params.id)

  // если товар уже есть в сторе, берём оттуда
  const cached = products.items.find((p) => p.id === id)
  if (cached) {
    product.value = cached
    loading.value = false
    return
  }

  try {
    product.value = await getProduct(id)
  } catch {
    error.value = 'Товар не найден'
  } finally {
    loading.value = false
  }
})

function addToCart() {
  if (!product.value) return
  const was = cart.has(product.value.id)
  cart.add(product.value)
  if (!was) toast.show('Добавлено в корзину')
}

function toggleFav() {
  if (!product.value) return
  const was = fav.has(product.value.id)
  fav.toggle(product.value.id)
  toast.show(was ? 'Убрано из избранного' : 'Добавлено в избранное')
}
</script>

<template>
  <section>
    <button class="back-btn" @click="router.back()">
      <ArrowLeft :size="16" />
      Назад
    </button>

    <div v-if="loading" class="status">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="status">
      <p style="color: #ef4444">{{ error }}</p>
    </div>

    <div v-else-if="product" class="product-layout">
      <div class="product-image">
        <img :src="product.thumbnail || product.images?.[0]" :alt="product.title" />
      </div>

      <div class="product-info">
        <span class="product-category">{{ product.category }}</span>
        <h1>{{ product.title }}</h1>

        <div class="rating" v-if="product.rating">
          <Star
            v-for="i in 5" :key="i" :size="16"
            :fill="i <= Math.round(product.rating) ? '#f59e0b' : 'none'"
            color="#f59e0b"
          />
          <span>{{ product.rating.toFixed(1) }}</span>
        </div>

        <p class="product-price">${{ product.price.toFixed(2) }}</p>
        <p class="product-desc">{{ product.description }}</p>

        <div class="product-buttons">
          <button class="btn-main" :class="{ 'btn-green': inCart }" @click="addToCart">
            <ShoppingCart :size="16" />
            {{ inCart ? 'В корзине' : 'В корзину' }}
          </button>

          <button class="btn-secondary" :class="{ 'btn-liked': inFav }" @click="toggleFav">
            <Heart :size="16" :fill="inFav ? 'currentColor' : 'none'" />
            {{ inFav ? 'В избранном' : 'В избранное' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 20px;
}
.back-btn:hover { background: #f9f9f9; }

.status { text-align: center; padding: 60px 16px; color: #999; }

.spinner {
  width: 28px; height: 28px;
  border: 3px solid #ddd; border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 0 auto;
}
@keyframes spin { to { transform: rotate(360deg); } }

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.product-image {
  background: #fafafa;
  border-radius: 10px;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 350px;
}
.product-image img { max-width: 100%; max-height: 300px; object-fit: contain; }

.product-category {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #999;
  font-weight: 600;
}

.product-info h1 {
  font-size: 1.35rem;
  margin: 6px 0 10px;
  line-height: 1.3;
}

.rating { display: flex; align-items: center; gap: 2px; margin-bottom: 12px; }
.rating span { margin-left: 6px; font-size: 0.85rem; color: #666; }

.product-price { font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; }

.product-desc {
  color: #555;
  font-size: 0.92rem;
  line-height: 1.6;
  margin-bottom: 24px;
}

.product-buttons { display: flex; gap: 10px; flex-wrap: wrap; }

.btn-main {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 20px;
  background: #2563eb; color: white; border: none;
  border-radius: 8px; font-weight: 600; font-size: 0.88rem; cursor: pointer;
}
.btn-main:hover { background: #1d4ed8; }
.btn-main.btn-green { background: #16a34a; }

.btn-secondary {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 20px;
  background: white; border: 1px solid #ddd;
  border-radius: 8px; font-weight: 600; font-size: 0.88rem; cursor: pointer; color: #555;
}
.btn-secondary:hover { background: #f9f9f9; }
.btn-secondary.btn-liked { color: #ef4444; border-color: #fca5a5; }

@media (max-width: 768px) {
  .product-layout { grid-template-columns: 1fr; gap: 20px; }
  .product-image { min-height: 220px; padding: 20px; }
  .product-buttons { flex-direction: column; }
  .product-buttons button { justify-content: center; }
}
</style>
