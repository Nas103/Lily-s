import Constants from 'expo-constants';
import { Platform } from 'react-native';

// API Configuration
// Dev host is derived automatically from the Metro dev server address that
// Expo Go connected to, so physical devices, simulators and the Android
// emulator all reach the Next.js backend without editing this file.
// Fallback (when hostUri is unavailable): Android emulator -> 10.0.2.2,
// everything else -> FALLBACK_DEV_HOST.
const FALLBACK_DEV_HOST = '192.168.8.37';

function getDevHost(): string {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as { manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } } })
      .manifest2?.extra?.expoGo?.debuggerHost ??
    '';

  if (hostUri) {
    const host = hostUri.split('/')[0].split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return host;
    }
  }

  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }

  return FALLBACK_DEV_HOST;
}

export const API_BASE_URL = __DEV__
  ? `http://${getDevHost()}:3000`
  : 'https://your-production-domain.com'; // Production - update with your deployed Next.js URL

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  AUTH_ME: '/api/auth/me',
  LOGOUT: '/api/auth/logout',

  // Orders
  ORDERS: '/api/orders',

  // Reviews
  REVIEWS: '/api/reviews',
  
  // Products
  PRODUCTS: '/api/products',
  
  // Profile
  PROFILE: '/api/profile',
  PROFILE_PASSWORD: '/api/profile/password',
  PROFILE_UPLOAD: '/api/profile/upload',
  
  // Cart & Checkout
  CHECKOUT: '/api/checkout',
  
  // Delivery Addresses
  DELIVERY_ADDRESSES: '/api/delivery-addresses',
  
  // Payment Methods
  PAYMENT_METHODS: '/api/payment-methods',
  
  // Currency
  CURRENCY: '/api/currency',
  
  // AI Chat
  AI_CHAT: '/api/ai-chat',
  
  // Recommendations
  RECOMMENDATIONS: '/api/recommendations',
  
  // Support
  SUPPORT: '/api/support',
} as const;

