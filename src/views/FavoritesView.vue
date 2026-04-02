<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Heart } from 'lucide-vue-next'
import { useFavoritesStore } from '../stores/favorites'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useToastStore } from '../stores/toast'
import { useRouter } from 'vue-router'

const fav = useFavoritesStore()
const products = useProductsStore()
const cart = useCartStore()
const toast = useToastStore()
const router = useRouter()

// избранное хранит только id, товары берём из стора каталога
const favProducts = computed(() => {
  return fav.ids
    .map((id) => products.items.find((p) => p.id === id))
    .filter(Boolean)
})

function addToCart(product: any) {
  const was = cart.has(product.id)
  cart.add(product)
  if (!was) toast.show('Добавлено в корзину')
}

function removeFav(id: number) {
  fav.toggle(id)
  toast.show('Убрано из избранного')
}

onMounted(() => {
  products.loadProducts()
})
</script>

<template>
  <section>
    <h1 class="title">Избранное</h1>

    <div v-if="favProducts.length === 0" class="empty">
      <Heart :size="40" color="#ccc" />
      <p>В избранном пока ничего нет</p>
      <button class="btn-primary" @click="router.push('/')">Перейти в каталог</button>
    </div>

    <div v-else class="grid">
      <div v-for="item in favProducts" :key="item!.id" class="card">
        <router-link :to="`/product/${item!.id}`" class="card-image">
          <img :src="item!.thumbnail" :alt="item!.title" />
        </router-link>

        <div class="card-body">
          <span class="card-cat">{{ item!.category }}</span>
          <router-link :to="`/product/${item!.id}`" class="card-title">{{ item!.title }}</router-link>
          <span class="card-price">${{ item!.price.toFixed(2) }}</span>

          <div class="card-actions">
            <button
              class="cart-btn"
              :class="{ added: cart.has(item!.id) }"
              @click="addToCart(item)"
            >{{ cart.has(item!.id) ? 'В корзине' : 'В корзину' }}</button>

            <button class="remove-btn" @click="removeFav(item!.id)" title="Убрать">✕</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.title { font-size: 1.4rem; font-weight: 700; margin-bottom: 20px; }

.empty { text-align: center; padding: 60px 20px; color: #999; }
.empty p { margin: 12px 0 20px; }

.btn-primary {
  padding: 10px 20px;
  background: #2563eb; color: white;
  border: none; border-radius: 6px;
  font-weight: 600; cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.card {
  background: white; border-radius: 10px; overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  display: flex; flex-direction: column;
}
.card:hover { box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1); }

.card-image {
  height: 180px; background: #fafafa;
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.card-image img { width: 100%; height: 100%; object-fit: contain; }

.card-body {
  padding: 12px 14px 14px;
  display: flex; flex-direction: column; flex: 1;
}

.card-cat {
  font-size: 0.68rem; text-transform: uppercase;
  color: #999; font-weight: 600; margin-bottom: 4px;
}

.card-title {
  font-size: 0.85rem; font-weight: 500; color: #1a1a1a;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; line-height: 1.35; margin-bottom: 6px; flex: 1;
}
.card-title:hover { color: #2563eb; }

.card-price { font-size: 1.05rem; font-weight: 700; margin-bottom: 10px; }

.card-actions { display: flex; gap: 6px; }

.cart-btn {
  flex: 1; padding: 7px 10px;
  background: #2563eb; color: white;
  border: none; border-radius: 6px;
  font-size: 0.8rem; font-weight: 600; cursor: pointer;
}
.cart-btn.added { background: #16a34a; }

.remove-btn {
  width: 32px; height: 32px;
  border: 1px solid #ddd; border-radius: 6px;
  background: white; cursor: pointer; color: #aaa; font-size: 0.85rem;
}
.remove-btn:hover { color: #ef4444; border-color: #fca5a5; }

@media (max-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
@media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
</style>
