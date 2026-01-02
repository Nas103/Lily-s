import { Platform } from 'react-native';

// API Configuration
// Update this with your production API URL
// For Android emulator, use: http://10.0.2.2:3000 (special IP that maps to host's localhost)
// For iOS simulator, use: http://localhost:3000
// For physical device (Expo Go), use your computer's IP: http://YOUR_IP:3000
// To find your IP: Mac/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
//                   Windows: ipconfig (look for IPv4 Address)
// Your computer's IP: 192.168.151.240 (for physical devices - update if it changes)
// Note: Android emulator uses 10.0.2.2, physical Android devices use computer's IP
export const API_BASE_URL = __DEV__
  ? (Platform.OS === 'android' ? 'http://192.168.151.240:3000' : 'http://localhost:3000')
  : 'https://your-production-domain.com'; // Production - update with your deployed Next.js URL

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  
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

