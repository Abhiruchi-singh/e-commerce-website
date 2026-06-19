export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: Address;
  customerType?: 'regular' | 'premium';
  preferredCategories?: string[];
  memberSince?: string;
  token?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  brand: string;
  image: string;
  images?: string[];
  stock: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  tags?: string[];
  sizes?: string[];
  colors?: string[];
}

export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  stock: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  _id: string;
  user: string;
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  page: number;
  pages: number;
  total: number;
}
