<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>

<template>
  <AppHeader />
  <main class="container main">
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </main>
  <ToastContainer />
</template>

<style scoped>
.main {
  padding-top: 24px;
  padding-bottom: 48px;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
