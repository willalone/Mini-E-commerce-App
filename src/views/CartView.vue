<script setup lang="ts">
import { ShoppingCart, Minus, Plus, X } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const router = useRouter()
</script>

<template>
  <section>
    <h1 class="title">Корзина</h1>

    <div v-if="cart.items.length === 0" class="empty">
      <ShoppingCart :size="40" color="#ccc" />
      <p>Корзина пуста</p>
      <button class="btn-primary" @click="router.push('/')">Перейти в каталог</button>
    </div>

    <div v-else class="cart-layout">
      <div class="cart-items">
        <div v-for="item in cart.items" :key="item.id" class="cart-row">
          <router-link :to="`/product/${item.id}`" class="cart-row-img">
            <img :src="item.image" :alt="item.title" />
          </router-link>

          <div class="cart-row-info">
            <router-link :to="`/product/${item.id}`" class="cart-row-title">
              {{ item.title }}
            </router-link>
            <span class="cart-row-price">${{ item.price.toFixed(2) }}</span>
          </div>

          <div class="qty-control">
            <button @click="cart.setQty(item.id, item.qty - 1)"><Minus :size="14" /></button>
            <span>{{ item.qty }}</span>
            <button @click="cart.setQty(item.id, item.qty + 1)"><Plus :size="14" /></button>
          </div>

          <span class="cart-row-subtotal">${{ (item.price * item.qty).toFixed(2) }}</span>

          <button class="remove-btn" @click="cart.remove(item.id)">
            <X :size="16" />
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <h2>Итого</h2>
        <div class="summary-line">
          <span>Товаров:</span>
          <span>{{ cart.count }} шт.</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-line summary-total">
          <span>Сумма:</span>
          <span>${{ cart.total.toFixed(2) }}</span>
        </div>
        <button class="btn-primary" style="width: 100%; margin-bottom: 8px" @click="router.push('/checkout')">
          Оформить заказ
        </button>
        <button class="btn-danger" @click="cart.clear()">Очистить корзину</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.title { font-size: 1.4rem; font-weight: 700; margin-bottom: 20px; }

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}
.empty p { margin: 12px 0 20px; font-size: 1rem; }

.btn-primary {
  padding: 10px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.88rem;
}
.btn-primary:hover { background: #1d4ed8; }

.btn-danger {
  width: 100%;
  padding: 9px 20px;
  background: white;
  color: #ef4444;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-danger:hover { background: #fef2f2; }

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  align-items: start;
}

.cart-items { display: flex; flex-direction: column; gap: 10px; }

.cart-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.cart-row-img {
  width: 60px; height: 60px; flex-shrink: 0;
  background: #fafafa; border-radius: 6px; padding: 6px;
  display: flex; align-items: center; justify-content: center;
}
.cart-row-img img { width: 100%; height: 100%; object-fit: contain; }

.cart-row-info { flex: 1; min-width: 0; }

.cart-row-title {
  font-size: 0.84rem; font-weight: 500; color: #1a1a1a;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}
.cart-row-title:hover { color: #2563eb; }

.cart-row-price { font-size: 0.75rem; color: #999; }

.qty-control { display: flex; align-items: center; gap: 2px; }
.qty-control button {
  width: 28px; height: 28px;
  border: 1px solid #ddd; border-radius: 6px; background: white;
  cursor: pointer; display: flex; align-items: center; justify-content: center; color: #555;
}
.qty-control span { width: 28px; text-align: center; font-weight: 600; font-size: 0.85rem; }

.cart-row-subtotal {
  font-weight: 700; font-size: 0.9rem; white-space: nowrap;
  min-width: 60px; text-align: right;
}

.remove-btn {
  background: none; border: none; color: #bbb; cursor: pointer; padding: 4px;
}
.remove-btn:hover { color: #ef4444; }

.cart-summary {
  background: white; border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 20px; position: sticky; top: 76px;
}
.cart-summary h2 { font-size: 1.05rem; margin-bottom: 14px; }

.summary-line {
  display: flex; justify-content: space-between;
  font-size: 0.88rem; color: #666; margin-bottom: 6px;
}
.summary-divider { height: 1px; background: #eee; margin: 10px 0; }
.summary-total { font-weight: 700; font-size: 1.1rem; color: #1a1a1a; margin-bottom: 16px; }

@media (max-width: 768px) {
  .cart-layout { grid-template-columns: 1fr; }
}
</style>
