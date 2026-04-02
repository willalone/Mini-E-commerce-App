<script setup lang="ts">
import { Heart } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { useFavoritesStore } from '../stores/favorites'
import { useToastStore } from '../stores/toast'
import type { Product } from '../types'

const props = defineProps<{ product: Product }>()

const cart = useCartStore()
const fav = useFavoritesStore()
const toast = useToastStore()

function addToCart() {
  const wasInCart = cart.has(props.product.id)
  cart.add(props.product)
  if (!wasInCart) {
    toast.show('Добавлено в корзину')
  }
}

function toggleFav() {
  const wasFav = fav.has(props.product.id)
  fav.toggle(props.product.id)
  toast.show(wasFav ? 'Убрано из избранного' : 'Добавлено в избранное')
}
</script>

<template>
  <div class="card">
    <router-link :to="`/product/${product.id}`" class="card-image">
      <img :src="product.thumbnail" :alt="product.title" />
    </router-link>

    <div class="card-body">
      <span class="card-category">{{ product.category }}</span>

      <router-link :to="`/product/${product.id}`" class="card-title">
        {{ product.title }}
      </router-link>

      <div class="card-bottom">
        <span class="card-price">${{ product.price.toFixed(2) }}</span>

        <div class="card-actions">
          <button
            class="icon-btn"
            :class="{ liked: fav.has(product.id) }"
            @click="toggleFav"
          >
            <Heart :size="16" :fill="fav.has(product.id) ? 'currentColor' : 'none'" />
          </button>

          <button
            class="add-btn"
            :class="{ added: cart.has(product.id) }"
            @click="addToCart"
          >
            {{ cart.has(product.id) ? 'В корзине' : 'Купить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
}

.card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-image {
  height: 180px;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-body {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-category {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #999;
  font-weight: 600;
  margin-bottom: 4px;
}

.card-title {
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.35;
  color: #1a1a1a;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: auto;
  padding-bottom: 10px;
}

.card-title:hover { color: #2563eb; }

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-price {
  font-size: 1.05rem;
  font-weight: 700;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #aaa;
  transition: all 0.15s;
}

.icon-btn:hover,
.icon-btn.liked {
  color: #ef4444;
  border-color: #fca5a5;
}

.add-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.add-btn:hover { background: #1d4ed8; }
.add-btn.added { background: #16a34a; }
</style>
