<script setup lang="ts">
import AdminProductsTable from '../components/AdminProductsTable.vue'
</script>

<template>
  <section class="admin">
    <h1 class="admin__title">Админ-панель</h1>
    <p class="admin__lead">Таблица товаров из dummyjson: фильтр по категории, сортировка по колонкам, пагинация на клиенте.</p>
    <AdminProductsTable />
  </section>
</template>

<style scoped lang="scss">
.admin__title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #0f172a;
}

.admin__lead {
  margin: 0 0 24px;
  color: #64748b;
  font-size: 0.95rem;
  max-width: 640px;
  line-height: 1.5;
}
</style>
