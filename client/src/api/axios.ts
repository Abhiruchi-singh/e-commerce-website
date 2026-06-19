import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('ecommerce_user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as { __retryCount?: number } & typeof error.config;
    if (!config) return Promise.reject(error);

    const shouldRetry =
      !error.response &&
      (error.code === 'ECONNABORTED' || error.message?.includes('Network Error'));

    if (shouldRetry && (config.__retryCount ?? 0) < 4) {
      config.__retryCount = (config.__retryCount ?? 0) + 1;
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return api(config);
    }

    return Promise.reject(error);
  },
);

export default api;
