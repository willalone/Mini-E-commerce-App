<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section class="not-found">
    <h1>404</h1>
    <p>Страница не найдена</p>
    <button @click="router.push('/')">На главную</button>
  </section>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 80px 20px;
}

.not-found h1 {
  font-size: 5rem;
  font-weight: 800;
  color: #ddd;
  line-height: 1;
}

.not-found p {
  font-size: 1.1rem;
  color: #999;
  margin: 12px 0 24px;
}

.not-found button {
  padding: 10px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}

.not-found button:hover {
  background: #1d4ed8;
}
</style>
