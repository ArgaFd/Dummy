// API base URL (adjust this based on your backend URL)
export const API_BASE_URL = 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  
  // Menu
  MENU: '/menu',
  MENU_CATEGORIES: '/menu/categories',
  
  // Orders
  ORDERS: '/orders',
  ORDER_ITEMS: (orderId) => `/orders/${orderId}/items`,
  ORDER_STATUS: (orderId) => `/orders/${orderId}/status`,
  ORDER_ITEM_STATUS: (orderId, itemId) => `/orders/${orderId}/items/${itemId}/status`,
  
  // Payments
  PAYMENTS: '/payments',
  PAYMENT_PROCESS: '/payments',
  PAYMENT_WEBHOOK: '/payments/webhook',
  
  // Reports
  REPORTS_DAILY: '/reports/daily',
  REPORTS_RANGE: '/reports/range',
};

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Token storage key
export const TOKEN_STORAGE_KEY = 'restaurant_app_token';
