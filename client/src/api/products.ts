import api from './axios';
import type { Product, ProductsResponse } from '../types';

export const getProducts = (params?: Record<string, string | number>) =>
  api.get<ProductsResponse>('/products', { params }).then((r) => r.data);

export const getProduct = (id: string) =>
  api.get<Product>(`/products/${id}`).then((r) => r.data);

export const getCategories = () =>
  api.get<string[]>('/products/categories').then((r) => r.data);

export const createProduct = (data: Partial<Product>) =>
  api.post<Product>('/products', data).then((r) => r.data);

export const updateProduct = (id: string, data: Partial<Product>) =>
  api.put<Product>(`/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`).then((r) => r.data);
