<template>
  <div class="skeleton-card">
    <div class="skeleton-image pulse"></div>
    <div class="skeleton-body">
      <div class="skeleton-line short pulse"></div>
      <div class="skeleton-line pulse"></div>
      <div class="skeleton-line medium pulse"></div>
      <div class="skeleton-bottom">
        <div class="skeleton-price pulse"></div>
        <div class="skeleton-btn pulse"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.skeleton-image {
  height: 180px;
  background: #eee;
}

.skeleton-body {
  padding: 12px 14px 14px;
}

.skeleton-line {
  height: 12px;
  border-radius: 4px;
  background: #eee;
  margin-bottom: 8px;
}

.skeleton-line.short { width: 40%; }
.skeleton-line.medium { width: 75%; }

.skeleton-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.skeleton-price {
  width: 60px;
  height: 18px;
  border-radius: 4px;
  background: #eee;
}

.skeleton-btn {
  width: 70px;
  height: 30px;
  border-radius: 6px;
  background: #eee;
}

.pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
