<script setup lang="ts">
import AdminProductsTable from '../components/AdminProductsTable.vue'
</script>

<template>
  <section class="admin">
    <h1 class="admin__title">Админ-панель</h1>
    <h2 class="admin__subtitle">Список товаров</h2>
    <p class="admin__lead">
      Данные из DummyJSON; фильтры (категория, цена), сортировка и пагинация в Pinia — как в типичном SPA со списками и табличной аналитикой.
    </p>
    <AdminProductsTable />
  </section>
</template>

<style scoped lang="scss">
.admin__title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: #0f172a;
}

.admin__subtitle {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 10px;
  color: #334155;
}

.admin__lead {
  margin: 0 0 24px;
  color: #64748b;
  font-size: 0.95rem;
  max-width: 640px;
  line-height: 1.5;
}
</style>
