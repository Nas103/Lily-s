/**
 * Sample Electronics Products Data
 * 
 * This file contains sample product data for the Electronics category.
 * Sub-categories: Apple, Samsung, Flagship
 * 
 * Apple (10 products):
 * - Each product has max 3 colors
 * - Each color has 3 images: front, back, side (not top)
 * 
 * Samsung (10 products):
 * - Each product has 3 colors
 * - Each color has 3 images: front, back, side (not top)
 * 
 * Flagship (15 products):
 * - Each product has max 2 colors
 * - Each color has 3 images: front, back, side (not top)
 * 
 * TODO: Replace image URLs with actual product images
 * TODO: Update prices, descriptions, and other details as needed
 */

import { Product } from '../types';

export const electronicsProducts: Product[] = [
  // Apple Sub-category (10 products)
  // TODO: Replace all product details (name, description, price) with actual information
  {
    id: 'electronics-apple-001',
    name: 'iPhone 17 Pro Max', // TODO: Update product name if needed
    slug: 'iphone-17-pro-max',
    description: 'The ultimate iPhone with A18 Pro chip, ProMotion display, and advanced camera system. Available in stunning finishes.', // TODO: Update product description
    category: 'electronics',
    subCategory: 'apple',
    price: 1299.99, // TODO: Update product price
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image with iPhone 17 Pro Max main image
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium'],
    colorImages: {
      'Natural Titanium': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image with iPhone 17 Pro Max Natural Titanium front view
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image with iPhone 17 Pro Max Natural Titanium back view
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image with iPhone 17 Pro Max Natural Titanium side view
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // Same as side (not used for electronics)
      },
      'Blue Titanium': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image with iPhone 17 Pro Max Blue Titanium front view
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image with iPhone 17 Pro Max Blue Titanium back view
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image with iPhone 17 Pro Max Blue Titanium side view
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // Same as side (not used for electronics)
      },
      'White Titanium': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image with iPhone 17 Pro Max White Titanium front view
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image with iPhone 17 Pro Max White Titanium back view
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image with iPhone 17 Pro Max White Titanium side view
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // Same as side (not used for electronics)
      },
    },
  },
  // TODO: Replace all product details (name, description, price) with actual information
  {
    id: 'electronics-apple-002',
    name: 'iPhone 17 Pro',
    slug: 'iphone-17-pro',
    description: 'Pro-level iPhone with A18 Pro chip and advanced camera system. Perfect balance of size and power.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1199.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Natural Titanium', 'Blue Titanium', 'Black Titanium'],
    colorImages: {
      'Natural Titanium': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Blue Titanium': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Black Titanium': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  // TODO: Replace all product details (name, description, price) with actual information
  {
    id: 'electronics-apple-003',
    name: 'iPhone 17',
    slug: 'iphone-17',
    description: 'The latest iPhone with A18 chip and all-day battery life. Available in vibrant colors.',
    category: 'electronics',
    subCategory: 'apple',
    price: 899.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Pink', 'Blue', 'Green'],
    colorImages: {
      'Pink': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Blue': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Green': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  {
    id: 'electronics-apple-004',
    name: 'iPad Pro 13-inch',
    slug: 'ipad-pro-13-inch',
    description: 'The most powerful iPad with M4 chip and Liquid Retina XDR display. Perfect for professionals.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1299.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Space Gray', 'Silver'],
    colorImages: {
      'Space Gray': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Silver': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-apple-005',
    name: 'MacBook Pro 16-inch',
    slug: 'macbook-pro-16-inch',
    description: 'Powerful laptop with M4 Pro chip, Liquid Retina XDR display, and all-day battery life.',
    category: 'electronics',
    subCategory: 'apple',
    price: 2499.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Space Gray', 'Silver'],
    colorImages: {
      'Space Gray': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Silver': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-apple-006',
    name: 'AirPods Pro 3',
    slug: 'airpods-pro-3',
    description: 'Premium wireless earbuds with active noise cancellation and spatial audio. MagSafe charging case.',
    category: 'electronics',
    subCategory: 'apple',
    price: 249.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['White'],
    colorImages: {
      'White': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
    },
  },
  {
    id: 'electronics-apple-007',
    name: 'Apple Watch Ultra 3',
    slug: 'apple-watch-ultra-3',
    description: 'The most rugged Apple Watch with titanium case, action button, and advanced health features.',
    category: 'electronics',
    subCategory: 'apple',
    price: 799.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Titanium', 'Ocean Blue', 'Trail Orange'],
    colorImages: {
      'Titanium': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Ocean Blue': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Trail Orange': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  {
    id: 'electronics-apple-008',
    name: 'Mac Studio',
    slug: 'mac-studio',
    description: 'Powerful desktop with M4 Ultra chip. Perfect for creative professionals and developers.',
    category: 'electronics',
    subCategory: 'apple',
    price: 3999.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Silver'],
    colorImages: {
      'Silver': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
    },
  },
  {
    id: 'electronics-apple-009',
    name: 'Apple Vision Pro',
    slug: 'apple-vision-pro',
    description: 'Revolutionary spatial computer with ultra-high-resolution displays and advanced eye tracking.',
    category: 'electronics',
    subCategory: 'apple',
    price: 3499.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['White'],
    colorImages: {
      'White': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
    },
  },
  {
    id: 'electronics-apple-010',
    name: 'iPad Air 13-inch',
    slug: 'ipad-air-13-inch',
    description: 'Powerful iPad with M4 chip and Liquid Retina display. Perfect for work and creativity.',
    category: 'electronics',
    subCategory: 'apple',
    price: 799.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Space Gray', 'Starlight', 'Blue'],
    colorImages: {
      'Space Gray': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Starlight': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Blue': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  
  // Samsung Sub-category (10 products)
  // Each product has 3 colors, each color has 3 images (front, back, side)
  {
    id: 'electronics-samsung-001',
    name: 'Samsung Galaxy S25 Ultra',
    slug: 'samsung-galaxy-s25-ultra',
    description: 'The ultimate Samsung flagship with Snapdragon 8 Gen 4, 200MP camera, and S Pen. Premium design and performance.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 1299.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet'],
    colorImages: {
      'Titanium Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Titanium Gray': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Titanium Violet': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  {
    id: 'electronics-samsung-002',
    name: 'Samsung Galaxy S25+',
    slug: 'samsung-galaxy-s25-plus',
    description: 'Premium Samsung smartphone with Snapdragon 8 Gen 4 and advanced camera system. Perfect balance of features and size.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 999.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Phantom Black', 'Cream', 'Lavender'],
    colorImages: {
      'Phantom Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Cream': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Lavender': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  {
    id: 'electronics-samsung-003',
    name: 'Samsung Galaxy S25',
    slug: 'samsung-galaxy-s25',
    description: 'Flagship Samsung smartphone with Snapdragon 8 Gen 4 and stunning display. Available in vibrant colors.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 899.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Phantom Black', 'Cream', 'Lavender'],
    colorImages: {
      'Phantom Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Cream': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Lavender': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  {
    id: 'electronics-samsung-004',
    name: 'Samsung Galaxy Z Fold 6',
    slug: 'samsung-galaxy-z-fold-6',
    description: 'Revolutionary foldable smartphone with dual displays. Unfold to tablet mode for enhanced productivity.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 1799.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Phantom Black', 'Titanium Silver', 'Titanium Gold'],
    colorImages: {
      'Phantom Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Titanium Silver': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Titanium Gold': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  {
    id: 'electronics-samsung-005',
    name: 'Samsung Galaxy Z Flip 6',
    slug: 'samsung-galaxy-z-flip-6',
    description: 'Compact foldable smartphone that flips open. Stylish design with powerful performance.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 999.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Mint', 'Graphite', 'Lavender'],
    colorImages: {
      'Mint': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Graphite': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Lavender': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  {
    id: 'electronics-samsung-006',
    name: 'Samsung Galaxy Tab S10 Ultra',
    slug: 'samsung-galaxy-tab-s10-ultra',
    description: 'Premium Android tablet with Snapdragon 8 Gen 4 and stunning AMOLED display. Perfect for productivity and creativity.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 1199.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Graphite', 'Beige', 'Navy'],
    colorImages: {
      'Graphite': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Beige': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Navy': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  {
    id: 'electronics-samsung-007',
    name: 'Samsung Galaxy Watch 7 Pro',
    slug: 'samsung-galaxy-watch-7-pro',
    description: 'Premium smartwatch with advanced health tracking, LTE connectivity, and rotating bezel. Titanium case.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 599.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Titanium Black', 'Titanium Silver', 'Titanium Gold'],
    colorImages: {
      'Titanium Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Titanium Silver': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Titanium Gold': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  {
    id: 'electronics-samsung-008',
    name: 'Samsung Galaxy Buds3 Pro',
    slug: 'samsung-galaxy-buds3-pro',
    description: 'Premium wireless earbuds with active noise cancellation, 360 Audio, and intelligent ANC. Long battery life.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 249.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Phantom Black', 'Lavender', 'Graphite'],
    colorImages: {
      'Phantom Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Lavender': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Graphite': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  {
    id: 'electronics-samsung-009',
    name: 'Samsung Galaxy Book4 Ultra',
    slug: 'samsung-galaxy-book4-ultra',
    description: 'Premium laptop with Intel Core i9, RTX 4070, and AMOLED display. Perfect for professionals and creators.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 2499.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Graphite', 'Silver', 'Beige'],
    colorImages: {
      'Graphite': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Silver': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Beige': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  {
    id: 'electronics-samsung-010',
    name: 'Samsung Galaxy A55 5G',
    slug: 'samsung-galaxy-a55-5g',
    description: 'Mid-range smartphone with premium features. Great camera, long battery life, and 5G connectivity.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 499.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Awesome Iceblue', 'Awesome Lilac', 'Awesome Navy'],
    colorImages: {
      'Awesome Iceblue': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Awesome Lilac': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
      'Awesome Navy': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=9',
      },
    },
  },
  
  // Flagship Sub-category (15 products)
  // Each product has max 2 colors, each color has 3 images (front, back, side)
  {
    id: 'electronics-flagship-001',
    name: 'Red Magic 11 Pro',
    slug: 'red-magic-11-pro',
    description: 'Gaming smartphone with Snapdragon 8 Gen 4, active cooling fan, and 165Hz display. Ultimate gaming performance.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 899.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Obsidian', 'Cyborg'],
    colorImages: {
      'Obsidian': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Cyborg': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-002',
    name: 'OnePlus 13 Pro',
    slug: 'oneplus-13-pro',
    description: 'Flagship smartphone with Snapdragon 8 Gen 4, Hasselblad camera, and Warp Charge 100W. Premium performance.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 999.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Emerald Forest', 'Volcanic Black'],
    colorImages: {
      'Emerald Forest': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Volcanic Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-003',
    name: 'Xiaomi 15 Ultra',
    slug: 'xiaomi-15-ultra',
    description: 'Premium flagship with Snapdragon 8 Gen 4, Leica camera system, and 120W fast charging. Exceptional photography.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 1099.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Titanium Black', 'Ceramic White'],
    colorImages: {
      'Titanium Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Ceramic White': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-004',
    name: 'Google Pixel 10 Pro',
    slug: 'google-pixel-10-pro',
    description: 'Premium Android smartphone with Tensor G5, advanced AI features, and exceptional camera. Pure Android experience.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 999.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Obsidian', 'Porcelain'],
    colorImages: {
      'Obsidian': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Porcelain': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-005',
    name: 'Oppo Find X8 Pro',
    slug: 'oppo-find-x8-pro',
    description: 'Flagship smartphone with Snapdragon 8 Gen 4, Hasselblad camera, and SuperVOOC charging. Premium design.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 1099.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Glossy Black', 'Glossy White'],
    colorImages: {
      'Glossy Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Glossy White': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-006',
    name: 'Vivo X200 Pro',
    slug: 'vivo-x200-pro',
    description: 'Premium flagship with MediaTek Dimensity 9400, Zeiss camera, and 120W charging. Exceptional photography.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 1049.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Black', 'Blue'],
    colorImages: {
      'Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Blue': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-007',
    name: 'Honor Magic 7 Pro',
    slug: 'honor-magic-7-pro',
    description: 'Flagship smartphone with Snapdragon 8 Gen 4, advanced AI, and 100W charging. Premium design and performance.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 949.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Black', 'Purple'],
    colorImages: {
      'Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Purple': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-008',
    name: 'Realme GT 7 Pro',
    slug: 'realme-gt-7-pro',
    description: 'Performance flagship with Snapdragon 8 Gen 4, 240W charging, and gaming features. Ultimate speed.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 799.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Orange', 'Black'],
    colorImages: {
      'Orange': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-009',
    name: 'Motorola Edge 50 Ultra',
    slug: 'motorola-edge-50-ultra',
    description: 'Premium flagship with Snapdragon 8 Gen 4, 200MP camera, and clean Android experience.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 899.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Peach Fuzz', 'Forest Gray'],
    colorImages: {
      'Peach Fuzz': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Forest Gray': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-010',
    name: 'Nothing Phone 3 Pro',
    slug: 'nothing-phone-3-pro',
    description: 'Unique flagship with transparent design, Glyph interface, and Snapdragon 8 Gen 4. Stand out from the crowd.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 899.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Black', 'White'],
    colorImages: {
      'Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'White': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-011',
    name: 'ASUS ROG Phone 9',
    slug: 'asus-rog-phone-9',
    description: 'Ultimate gaming smartphone with Snapdragon 8 Gen 4, active cooling, and 165Hz display. Built for gamers.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 1099.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Phantom Black', 'Storm White'],
    colorImages: {
      'Phantom Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Storm White': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-012',
    name: 'Sony Xperia 1 VI',
    slug: 'sony-xperia-1-vi',
    description: 'Professional flagship with 4K display, Alpha camera technology, and Snapdragon 8 Gen 4. For creators.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 1299.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Platinum Silver', 'Black'],
    colorImages: {
      'Platinum Silver': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-013',
    name: 'Tecno Phantom X2 Pro',
    slug: 'tecno-phantom-x2-pro',
    description: 'Premium flagship with MediaTek Dimensity 9400, 200MP camera, and fast charging. Exceptional value.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 699.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Stardust Gray', 'Moonlight Silver'],
    colorImages: {
      'Stardust Gray': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Moonlight Silver': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-014',
    name: 'Infinix Zero Ultra 5G',
    slug: 'infinix-zero-ultra-5g',
    description: 'Flagship smartphone with MediaTek Dimensity 9400, 200MP camera, and 180W charging. Premium features.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 599.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Cosmic Blue', 'Nebula Black'],
    colorImages: {
      'Cosmic Blue': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Nebula Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
  {
    id: 'electronics-flagship-015',
    name: 'POCO F7 Pro',
    slug: 'poco-f7-pro',
    description: 'Performance flagship with Snapdragon 8 Gen 4, 120W charging, and gaming features. Exceptional value.',
    category: 'electronics',
    subCategory: 'flagship',
    price: 649.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with main product image
    colors: ['Yellow', 'Black'],
    colorImages: {
      'Yellow': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=3',
      },
      'Black': {
        front: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace with front view image
        back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace with back view image
        side: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace with side view image
        top: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80&v=6',
      },
    },
  },
];

