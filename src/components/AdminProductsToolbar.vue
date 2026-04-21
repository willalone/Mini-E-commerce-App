<script setup lang="ts">
defineProps<{
  categories: string[]
  category: string
  priceMin: number
  priceMax: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:category': [value: string]
  'update:priceMin': [value: number]
  'update:priceMax': [value: number]
}>()

function onCategory(e: Event) {
  emit('update:category', (e.target as HTMLSelectElement).value)
}

function parsePriceInput(raw: string): number {
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

function onPriceMin(e: Event) {
  emit('update:priceMin', parsePriceInput((e.target as HTMLInputElement).value))
}

function onPriceMax(e: Event) {
  emit('update:priceMax', parsePriceInput((e.target as HTMLInputElement).value))
}
</script>

<template>
  <div class="toolbar" :class="{ 'toolbar--disabled': disabled }">
    <label class="toolbar__field">
      <span class="toolbar__label">Категория</span>
      <select
        class="toolbar__select"
        :value="category"
        :disabled="disabled"
        @change="onCategory"
      >
        <option value="">Все</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
    </label>

    <div class="toolbar__field toolbar__field--row">
      <span class="toolbar__label">Цена, $</span>
      <div class="toolbar__prices">
        <input
          class="toolbar__input"
          type="number"
          min="0"
          step="0.01"
          placeholder="от"
          :value="priceMin || ''"
          :disabled="disabled"
          @input="onPriceMin"
        />
        <span class="toolbar__dash">—</span>
        <input
          class="toolbar__input"
          type="number"
          min="0"
          step="0.01"
          placeholder="до"
          :value="priceMax || ''"
          :disabled="disabled"
          @input="onPriceMax"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$border: #e2e8f0;
$muted: #64748b;
$accent: #2563eb;

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 20px;

  &--disabled {
    opacity: 0.55;
    pointer-events: none;
  }
}

.toolbar__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;

  &--row {
    flex: 1 1 220px;
    max-width: 320px;
  }
}

.toolbar__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: $muted;
}

.toolbar__select,
.toolbar__input {
  padding: 8px 10px;
  border: 1px solid $border;
  border-radius: 8px;
  background: #fff;
  font-size: 0.9rem;
  width: 100%;
  min-width: 0;

  &:focus {
    outline: 2px solid rgba(37, 99, 235, 0.35);
    border-color: $accent;
  }
}

.toolbar__prices {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar__input {
  flex: 1;
  min-width: 0;
}

.toolbar__dash {
  color: $muted;
  font-size: 0.85rem;
  flex-shrink: 0;
}
</style>
