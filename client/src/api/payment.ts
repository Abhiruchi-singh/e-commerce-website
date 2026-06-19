import api from './axios';

export const getPaymentConfig = () =>
  api.get<{ keyId: string; enabled: boolean }>('/payment/config').then((r) => r.data);

export const createRazorpayOrder = (amount: number) =>
  api.post<{ orderId: string; amount: number; currency: string }>('/payment/create-order', { amount }).then((r) => r.data);
