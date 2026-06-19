import api from './axios';
import type { CartItem, Order, ShippingAddress } from '../types';

export const createOrder = (data: {
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}) => api.post<Order>('/orders', data).then((r) => r.data);

export const getMyOrders = () => api.get<Order[]>('/orders/my').then((r) => r.data);

export const getOrder = (id: string) => api.get<Order>(`/orders/${id}`).then((r) => r.data);

export const getAllOrders = () => api.get<Order[]>('/orders').then((r) => r.data);

export const updateOrderStatus = (id: string, status: string) =>
  api.put<Order>(`/orders/${id}/status`, { status }).then((r) => r.data);

export const trackOrder = (orderId: string, email: string) =>
  api.post<Order>('/orders/track', { orderId, email }).then((r) => r.data);
