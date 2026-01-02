import axios, { AxiosInstance, AxiosError } from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth headers
api.interceptors.request.use(
  async (config) => {
    const userId = await SecureStore.getItemAsync('userId');
    const userEmail = await SecureStore.getItemAsync('userEmail');
    
    if (userId && userEmail) {
      config.headers['x-user-id'] = userId;
      config.headers['x-user-email'] = userEmail;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      await SecureStore.deleteItemAsync('userId');
      await SecureStore.deleteItemAsync('userEmail');
    }
    
    // Better error messages for network errors
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.message?.includes('Network Error')) {
      const platform = Platform.OS;
      const apiUrl = API_BASE_URL;
      let troubleshooting = '';
      
      if (platform === 'android') {
        troubleshooting = `\n\nPhysical Android Device Troubleshooting:
1. Backend should be running: http://localhost:3000
2. Using API URL: ${apiUrl}
3. Make sure phone and computer are on the SAME WiFi network
4. Try reloading the app (shake device → Reload)
5. Check if your computer's firewall is blocking port 3000
6. Verify your computer's IP hasn't changed`;
      } else {
        troubleshooting = `\n\niOS Simulator Troubleshooting:
1. Backend should be running: http://localhost:3000
2. Using API URL: ${apiUrl}
3. localhost should work for iOS simulator`;
      }
      
      const networkError = new Error(
        `Unable to connect to server at ${apiUrl}${troubleshooting}`
      );
      return Promise.reject(networkError);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
      return response.data;
    } catch (error: any) {
      // Handle axios errors
      if (error.response) {
        throw new Error(error.response.data?.error || 'Login failed');
      }
      if (error.message) {
        throw error;
      }
      throw new Error('Unable to connect to server');
    }
  },
  
  register: async (email: string, password: string, name?: string) => {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, { 
        email, 
        password, 
        name 
      });
      return response.data;
    } catch (error: any) {
      // Handle axios errors
      if (error.response) {
        throw new Error(error.response.data?.error || 'Registration failed');
      }
      if (error.message) {
        throw error;
      }
      throw new Error('Unable to connect to server');
    }
  },
};

// Products API
export const productsAPI = {
  getAll: async (params?: { 
    category?: string; 
    subCategory?: string;
    search?: string; 
    country?: string;
  }) => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS, { params });
    // Backend returns array directly, not wrapped in { products: [...] }
    const data = response.data;
    return {
      products: Array.isArray(data) ? data : (data?.products || []),
    };
  },
};

// Profile API
export const profileAPI = {
  get: async () => {
    const response = await api.get(API_ENDPOINTS.PROFILE);
    return response.data;
  },
  
  update: async (data: any) => {
    const response = await api.patch(API_ENDPOINTS.PROFILE, data);
    return response.data;
  },
  
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.patch(API_ENDPOINTS.PROFILE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Delivery Addresses API
export const deliveryAddressesAPI = {
  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.DELIVERY_ADDRESSES);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post(API_ENDPOINTS.DELIVERY_ADDRESSES, data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.patch(
      `${API_ENDPOINTS.DELIVERY_ADDRESSES}/${id}`,
      data
    );
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(
      `${API_ENDPOINTS.DELIVERY_ADDRESSES}/${id}`
    );
    return response.data;
  },
};

// Payment Methods API
export const paymentMethodsAPI = {
  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.PAYMENT_METHODS);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post(API_ENDPOINTS.PAYMENT_METHODS, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(
      `${API_ENDPOINTS.PAYMENT_METHODS}/${id}`
    );
    return response.data;
  },
};

// Checkout API
export const checkoutAPI = {
  create: async (items: any[], deliveryAddressId?: string, paymentMethodId?: string) => {
    const response = await api.post(API_ENDPOINTS.CHECKOUT, {
      items,
      deliveryAddressId,
      paymentMethodId,
    });
    return response.data;
  },
};

// Currency API
export const currencyAPI = {
  getRates: async (baseCurrency: string = 'USD') => {
    const response = await api.get(API_ENDPOINTS.CURRENCY, {
      params: { base: baseCurrency },
    });
    return response.data;
  },
};

// AI Chat API
export const aiChatAPI = {
  sendMessage: async (message: string, context?: any) => {
    // Format messages array for conversation context
    const messages = context?.messages || [];
    
    // Add the new user message
    const allMessages = [
      ...messages,
      {
        role: 'user' as const,
        content: message,
      },
    ];

    try {
      const response = await api.post(API_ENDPOINTS.AI_CHAT, {
        messages: allMessages,
        context: context?.context || {},
      }, {
        timeout: 30000, // 30 second timeout
      });
      
      // Return in a format compatible with the mobile app
      const reply = response.data.reply || response.data.message || response.data.response || '';
      
      if (!reply) {
        throw new Error('Empty response from AI service');
      }
      
      return {
        reply: reply,
        message: reply,
        response: reply,
        ...response.data,
      };
    } catch (error: any) {
      console.error('AI Chat API Error:', error);
      
      // Re-throw with more context
      if (error.response) {
        // Server responded with error status
        throw new Error(`Server error: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`);
      } else if (error.request) {
        // Request made but no response
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Error setting up request
        throw new Error(error.message || 'Failed to send message');
      }
    }
  },
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendations: async (cartItems: any[], limit: number = 10) => {
    const categories = cartItems.map((item) => {
      if (typeof item.category === 'string') return item.category;
      return item.category?.name || item.category?.slug || 'other';
    }).filter(Boolean);
    
    const response = await api.post(API_ENDPOINTS.RECOMMENDATIONS, {
      cartItems: cartItems.map((item) => ({
        id: item.id || item.productId,
        name: item.name,
        category: typeof item.category === 'string' 
          ? item.category 
          : item.category?.name || item.category?.slug,
        product: item.product || item,
      })),
      categories,
      limit,
    });
    return response.data;
  },
};

export default api;

