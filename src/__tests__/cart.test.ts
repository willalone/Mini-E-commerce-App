import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../stores/cart'

const product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  thumbnail: 'https://example.com/img.png',
  description: '',
  category: 'test',
  rating: 4.5,
}

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('добавляет товар в корзину', () => {
    const cart = useCartStore()
    cart.add(product)

    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].qty).toBe(1)
    expect(cart.count).toBe(1)
  })

  it('увеличивает количество при повторном добавлении', () => {
    const cart = useCartStore()
    cart.add(product)
    cart.add(product)

    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].qty).toBe(2)
    expect(cart.total).toBeCloseTo(59.98)
  })

  it('удаляет товар из корзины', () => {
    const cart = useCartStore()
    cart.add(product)
    cart.remove(1)

    expect(cart.items).toHaveLength(0)
  })
})
