<script setup lang="ts">
defineProps<{
  current: number
  total: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()
</script>

<template>
  <div class="pagination" v-if="total > 1">
    <button :disabled="current <= 1" @click="emit('change', current - 1)">&laquo;</button>
    <button
      v-for="p in total" :key="p"
      :class="{ active: p === current }"
      @click="emit('change', p)"
    >{{ p }}</button>
    <button :disabled="current >= total" @click="emit('change', current + 1)">&raquo;</button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 24px;
}

.pagination button {
  min-width: 34px;
  height: 34px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.85rem;
  color: #555;
}

.pagination button:disabled {
  opacity: 0.3;
  cursor: default;
}

.pagination button.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.pagination button:hover:not(:disabled):not(.active) {
  background: #f5f5f5;
}
</style>
