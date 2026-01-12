import axios, { type AxiosResponse } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS, TOKEN_STORAGE_KEY } from '../config/api';

// Type definitions
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  is_available: boolean;
}

export interface Order {
  id: number;
  table_number: number;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: DEFAULT_HEADERS,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }): Promise<AxiosResponse<ApiResponse<AuthResponse>>> => api.post(API_ENDPOINTS.LOGIN, credentials),
  register: (userData: { name: string; email: string; password: string; role?: string }): Promise<AxiosResponse<ApiResponse<any>>> => api.post(API_ENDPOINTS.REGISTER, userData),
  getMe: (): Promise<AxiosResponse<ApiResponse<any>>> => api.get(API_ENDPOINTS.ME),
};

// Menu API
export const menuAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<{ items: MenuItem[] }>>> => api.get(API_ENDPOINTS.MENU),
  getById: (id: number): Promise<AxiosResponse<ApiResponse<MenuItem>>> => api.get(`${API_ENDPOINTS.MENU}/${id}`),
  create: (menuData: Partial<MenuItem>): Promise<AxiosResponse<ApiResponse<MenuItem>>> => api.post(API_ENDPOINTS.MENU, menuData),
  update: (id: number, menuData: Partial<MenuItem>): Promise<AxiosResponse<ApiResponse<MenuItem>>> => api.put(`${API_ENDPOINTS.MENU}/${id}`, menuData),
  delete: (id: number): Promise<AxiosResponse<ApiResponse<any>>> => api.delete(`${API_ENDPOINTS.MENU}/${id}`),
  getCategories: (): Promise<AxiosResponse<ApiResponse<string[]>>> => api.get(API_ENDPOINTS.MENU_CATEGORIES),
};

// Orders API
export const orderAPI = {
  getAll: (params = {}): Promise<AxiosResponse<ApiResponse<Order[]>>> => api.get(API_ENDPOINTS.ORDERS, { params }),
  getById: (id: number): Promise<AxiosResponse<ApiResponse<Order>>> => api.get(`${API_ENDPOINTS.ORDERS}/${id}`),
  create: (orderData: { tableNumber: number; customerName: string; items: { menuId: number; quantity: number }[] }): Promise<AxiosResponse<ApiResponse<Order>>> => api.post(API_ENDPOINTS.ORDERS, orderData),
  createGuest: (orderData: { tableNumber: number; customerName: string; items: { menuId: number; quantity: number }[] }): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.post(`${API_ENDPOINTS.ORDERS}/guest`, orderData),
  getGuestById: (id: number): Promise<AxiosResponse<ApiResponse<any>>> => api.get(`${API_ENDPOINTS.ORDERS}/guest/${id}`),
  updateStatus: (orderId: number, status: string): Promise<AxiosResponse<ApiResponse<Order>>> => 
    api.put(`${API_ENDPOINTS.ORDERS}/${orderId}/status`, { status }),
  getMyOrders: (): Promise<AxiosResponse<ApiResponse<Order[]>>> => api.get(`${API_ENDPOINTS.ORDERS}/my`),
};

// Payments API
export const paymentAPI = {
  create: (paymentData: { order_id: number; amount: number; payment_method: string }): Promise<AxiosResponse<ApiResponse<Payment>>> => api.post(API_ENDPOINTS.PAYMENTS, paymentData),
  getAll: (): Promise<AxiosResponse<ApiResponse<{ payments: Payment[]; totalItems: number; totalPages: number; currentPage: number }>>> => api.get(API_ENDPOINTS.PAYMENTS),
  getById: (id: number): Promise<AxiosResponse<ApiResponse<Payment>>> => api.get(`${API_ENDPOINTS.PAYMENTS}/${id}`),
  updateStatus: (id: number, status: string): Promise<AxiosResponse<ApiResponse<Payment>>> => 
    api.put(`${API_ENDPOINTS.PAYMENTS}/${id}/status`, { status }),
  guestQris: (payload: { orderId: number; customer?: any }): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.post(`${API_ENDPOINTS.PAYMENTS}/guest/qris`, payload),
  guestManual: (payload: { orderId: number }): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.post(`${API_ENDPOINTS.PAYMENTS}/guest/manual`, payload),
};

// Reports API
export const reportAPI = {
  getDailyReport: (date: string): Promise<AxiosResponse<ApiResponse<any>>> => 
    api.get(API_ENDPOINTS.REPORTS_DAILY, { params: { date } }),
  getDateRangeReport: (startDate: string, endDate: string): Promise<AxiosResponse<ApiResponse<any>>> => 
    api.get(API_ENDPOINTS.REPORTS_RANGE, { 
      params: { startDate, endDate } 
    }),
};

export default api;
