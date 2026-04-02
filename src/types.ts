export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  rating: number
  thumbnail: string
  images?: string[]
}

export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  qty: number
}

export interface OrderForm {
  name: string
  phone: string
  email: string
  address: string
  comment: string
}
