/**
 * Sample Lifestyle Shoe Products Data
 * 
 * This file contains sample product data for the Lifestyle category.
 * 10 products have 3 colors max with full colorImages structure (front, back, side, top).
 * 
 * TODO: Replace image URLs with actual product images
 * TODO: Update prices, descriptions, and other details as needed
 */

import { Product } from '../types';

export const lifestyleProducts: Product[] = [
  // Products with 3 colors (10 products)
  {
    id: 'lifestyle-001',
    name: 'Nike LeBron TR1',
    slug: 'nike-lebron-tr1',
    description: 'Premium lifestyle sneaker with advanced cushioning technology. Perfect for everyday wear and casual outings.',
    category: 'lifestyle',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace with actual image
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'White', 'Red'],
    colorImages: {
      'Black': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'White': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
      'Red': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'lifestyle-002',
    name: 'Adidas Originals Superstar',
    slug: 'adidas-originals-superstar',
    description: 'Classic shell-toe design with iconic three stripes. Timeless style for the modern lifestyle.',
    category: 'lifestyle',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['White', 'Black', 'Navy'],
    colorImages: {
      'White': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'Black': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
      'Navy': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'lifestyle-003',
    name: 'Puma Suede Classic',
    slug: 'puma-suede-classic',
    description: 'Iconic suede upper with Formstrip branding. A streetwear essential for any wardrobe.',
    category: 'lifestyle',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'White', 'Grey'],
    colorImages: {
      'Black': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'White': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
      'Grey': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'lifestyle-004',
    name: 'New Balance 574',
    slug: 'new-balance-574',
    description: 'Classic running-inspired design with premium materials. Comfort meets style.',
    category: 'lifestyle',
    price: 99.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Navy', 'Grey', 'Beige'],
    colorImages: {
      'Navy': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'Grey': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
      'Beige': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'lifestyle-005',
    name: 'Vans Old Skool',
    slug: 'vans-old-skool',
    description: 'The iconic side stripe design. A skateboarding classic that transcends generations.',
    category: 'lifestyle',
    price: 69.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'White', 'Red'],
    colorImages: {
      'Black': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'White': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
      'Red': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'lifestyle-006',
    name: 'Converse Chuck Taylor All Star',
    slug: 'converse-chuck-taylor-all-star',
    description: 'The original basketball shoe, now a cultural icon. Timeless design for everyday wear.',
    category: 'lifestyle',
    price: 59.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'White', 'Navy'],
    colorImages: {
      'Black': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'White': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
      'Navy': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'lifestyle-007',
    name: 'Nike Air Force 1',
    slug: 'nike-air-force-1',
    description: 'The basketball icon that made the transition from court to street. Premium leather construction.',
    category: 'lifestyle',
    price: 109.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['White', 'Black', 'Triple White'],
    colorImages: {
      'White': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'Black': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
      'Triple White': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'lifestyle-008',
    name: 'Adidas Stan Smith',
    slug: 'adidas-stan-smith',
    description: 'The original tennis shoe. Clean, minimalist design with premium leather upper.',
    category: 'lifestyle',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['White', 'Green', 'Navy'],
    colorImages: {
      'White': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'Green': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
      'Navy': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'lifestyle-009',
    name: 'Reebok Classic Leather',
    slug: 'reebok-classic-leather',
    description: 'Vintage-inspired design with premium leather construction. A timeless classic.',
    category: 'lifestyle',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['White', 'Black', 'Grey'],
    colorImages: {
      'White': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'Black': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
      'Grey': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'lifestyle-010',
    name: 'Jordan 1 Retro High',
    slug: 'jordan-1-retro-high',
    description: 'The shoe that started it all. Iconic design with premium materials and heritage styling.',
    category: 'lifestyle',
    price: 179.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Bred', 'Royal', 'Shadow'],
    colorImages: {
      'Bred': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'Royal': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
      'Shadow': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  // Products with fewer colors (5 products)
  {
    id: 'lifestyle-011',
    name: 'Nike Dunk Low',
    slug: 'nike-dunk-low',
    description: 'Basketball heritage meets street style. Low-top design with premium materials.',
    category: 'lifestyle',
    price: 119.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'White'],
    colorImages: {
      'Black': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'White': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
    },
  },
  {
    id: 'lifestyle-012',
    name: 'Adidas Gazelle',
    slug: 'adidas-gazelle',
    description: 'Classic suede upper with retro styling. A timeless favorite for casual wear.',
    category: 'lifestyle',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Blue', 'Black'],
    colorImages: {
      'Blue': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'Black': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
    },
  },
  {
    id: 'lifestyle-013',
    name: 'Puma RS-X',
    slug: 'puma-rs-x',
    description: 'Retro-futuristic design with bold color blocking. Stand out from the crowd.',
    category: 'lifestyle',
    price: 99.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['White', 'Black'],
    colorImages: {
      'White': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'Black': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
    },
  },
  {
    id: 'lifestyle-014',
    name: 'New Balance 550',
    slug: 'new-balance-550',
    description: 'Basketball-inspired design with premium suede and leather construction.',
    category: 'lifestyle',
    price: 109.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['White', 'Grey'],
    colorImages: {
      'White': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'Grey': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
    },
  },
  {
    id: 'lifestyle-015',
    name: 'Vans Authentic',
    slug: 'vans-authentic',
    description: 'The original Vans design. Simple, classic, and endlessly versatile.',
    category: 'lifestyle',
    price: 64.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'White'],
    colorImages: {
      'Black': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'White': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
    },
  },
];

