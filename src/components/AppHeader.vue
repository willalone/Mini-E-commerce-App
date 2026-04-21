<script setup lang="ts">
import { ShoppingBag, Heart, ShoppingCart, LayoutDashboard } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { useFavoritesStore } from '../stores/favorites'

const cart = useCartStore()
const fav = useFavoritesStore()
</script>

<template>
  <header class="header">
    <div class="header-inner container">
      <router-link to="/" class="logo">
        <ShoppingBag :size="20" />
        <span>Mini Shop</span>
      </router-link>

      <nav class="nav">
        <router-link to="/" class="nav-link" exact-active-class="active">Каталог</router-link>

        <router-link to="/admin" class="nav-link" active-class="active" title="Админ">
          <LayoutDashboard :size="18" />
        </router-link>

        <router-link to="/favorites" class="nav-link" active-class="active">
          <Heart :size="18" />
          <span class="badge" v-if="fav.count">{{ fav.count }}</span>
        </router-link>

        <router-link to="/cart" class="nav-link" active-class="active">
          <ShoppingCart :size="18" />
          <span class="badge" v-if="cart.count">{{ cart.count }}</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: #0f172a;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-inner {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 700;
  font-size: 1.05rem;
}

.nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  color: #94a3b8;
  font-size: 0.88rem;
  font-weight: 500;
  border-radius: 6px;
  position: relative;
  transition: color 0.15s;
}

.nav-link:hover,
.nav-link.active {
  color: white;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #2563eb;
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 480px) {
  .logo span { display: none; }
}
</style>
