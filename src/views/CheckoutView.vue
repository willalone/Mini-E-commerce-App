<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useToastStore } from '../stores/toast'
import type { OrderForm } from '../types'

const cart = useCartStore()
const toast = useToastStore()
const router = useRouter()

const form = reactive<OrderForm>({
  name: '',
  phone: '',
  email: '',
  address: '',
  comment: '',
})

const errors = reactive<Record<string, string>>({})
const submitted = ref(false)

function validate(): boolean {
  const e: Record<string, string> = {}

  if (!form.name.trim()) e.name = 'Введите имя'
  if (!form.phone.trim()) {
    e.phone = 'Введите телефон'
  } else if (!/^\+?\d{10,15}$/.test(form.phone.replace(/\s/g, ''))) {
    e.phone = 'Некорректный номер'
  }
  if (!form.email.trim()) {
    e.email = 'Введите email'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    e.email = 'Некорректный email'
  }
  if (!form.address.trim()) e.address = 'Введите адрес'

  Object.keys(errors).forEach((k) => delete errors[k])
  Object.assign(errors, e)

  return Object.keys(e).length === 0
}

function submit() {
  if (!validate()) return

  submitted.value = true
  cart.clear()
  toast.show('Заказ оформлен!', 'success')
}
</script>

<template>
  <section>
    <h1 class="title">Оформление заказа</h1>

    <div v-if="submitted" class="success-block">
      <h2>Спасибо за заказ!</h2>
      <p>Мы свяжемся с вами в ближайшее время.</p>
      <button class="btn-primary" @click="router.push('/')">Вернуться в каталог</button>
    </div>

    <div v-else-if="cart.items.length === 0" class="empty">
      <p>Корзина пуста. Добавьте товары перед оформлением.</p>
      <button class="btn-primary" @click="router.push('/')">В каталог</button>
    </div>

    <div v-else class="checkout-layout">
      <form @submit.prevent="submit" class="form" novalidate>
        <div class="field">
          <label>Имя *</label>
          <input v-model="form.name" type="text" placeholder="Иван Иванов" />
          <span class="error" v-if="errors.name">{{ errors.name }}</span>
        </div>

        <div class="field">
          <label>Телефон *</label>
          <input v-model="form.phone" type="tel" placeholder="+7 999 123 45 67" />
          <span class="error" v-if="errors.phone">{{ errors.phone }}</span>
        </div>

        <div class="field">
          <label>Email *</label>
          <input v-model="form.email" type="email" placeholder="example@mail.com" />
          <span class="error" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="field">
          <label>Адрес доставки *</label>
          <input v-model="form.address" type="text" placeholder="г. Москва, ул. Примерная, д.1" />
          <span class="error" v-if="errors.address">{{ errors.address }}</span>
        </div>

        <div class="field">
          <label>Комментарий</label>
          <textarea v-model="form.comment" rows="3" placeholder="Пожелания к заказу..."></textarea>
        </div>

        <button type="submit" class="btn-primary submit-btn">
          Подтвердить заказ — ${{ cart.total.toFixed(2) }}
        </button>
      </form>

      <div class="order-summary">
        <h3>Ваш заказ</h3>
        <div v-for="item in cart.items" :key="item.id" class="order-item">
          <img :src="item.image" :alt="item.title" />
          <div>
            <span class="order-item-title">{{ item.title }}</span>
            <span class="order-item-qty">{{ item.qty }} × ${{ item.price.toFixed(2) }}</span>
          </div>
        </div>
        <div class="order-total">
          <span>Итого:</span>
          <span>${{ cart.total.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.title { font-size: 1.4rem; font-weight: 700; margin-bottom: 20px; }

.success-block {
  text-align: center;
  padding: 60px 20px;
}
.success-block h2 { color: #16a34a; margin-bottom: 8px; }
.success-block p { color: #666; margin-bottom: 20px; }

.empty { text-align: center; padding: 60px 20px; color: #999; }
.empty p { margin-bottom: 16px; }

.btn-primary {
  padding: 10px 20px;
  background: #2563eb; color: white;
  border: none; border-radius: 6px;
  font-weight: 600; font-size: 0.88rem; cursor: pointer;
}
.btn-primary:hover { background: #1d4ed8; }

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 28px;
  align-items: start;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field label {
  display: block;
  font-size: 0.84rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.field input,
.field textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.88rem;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.field .error {
  font-size: 0.78rem;
  color: #ef4444;
  margin-top: 4px;
  display: block;
}

.submit-btn {
  margin-top: 8px;
  padding: 12px 24px;
  font-size: 0.95rem;
}

.order-summary {
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 20px;
  position: sticky;
  top: 76px;
}

.order-summary h3 { font-size: 1rem; margin-bottom: 14px; }

.order-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item img {
  width: 40px; height: 40px;
  object-fit: contain;
  background: #fafafa;
  border-radius: 4px;
  padding: 4px;
}

.order-item-title {
  font-size: 0.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.order-item-qty {
  font-size: 0.75rem;
  color: #999;
  display: block;
}

.order-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.05rem;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .checkout-layout { grid-template-columns: 1fr; }
}
</style>
