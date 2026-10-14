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
 * Samsung (12 products):
 * - Galaxy S26 Ultra (256GB/512GB/1TB), Galaxy S26+ (256GB/512GB/1TB),
 *   Galaxy S26 FE (128GB/256GB), Galaxy Z Fold8 (256GB/512GB),
 *   Galaxy Watch Ultra2, Galaxy Buds4 Pro
 * - Each color has 4 images: front, back, side, top
 * - Images served from /electronics/Samsung/<device>/<color>/<view>.webp
 * - Prices converted from ZAR to USD (1 USD = 18.5 ZAR)
 * 
 * Flagship (15 products):
 * - Each product has max 2 colors
 * - Each color has 3 images: front, back, side (not top)
 */

import { Product } from '../types';

export const electronicsProducts: Product[] = [
  // Apple Sub-category (27 products)
  {
    id: 'electronics-apple-001',
    name: 'iPhone 18 Pro 256GB',
    slug: 'iphone-18-pro-256gb',
    description: 'The iPhone 18 Pro pairs the A20 Pro chip with a ProMotion Super Retina XDR display and an advanced pro camera system. Pro further.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1556.7,
    imageUrl: '/electronics/Apple/iphone-18-pro/black/front.webp',
    colors: ['Black', 'Glacier', 'Purple', 'Silver'],
    colorImages: {
      'Black': {
        front: '/electronics/Apple/iphone-18-pro/black/front.webp',
        back: '/electronics/Apple/iphone-18-pro/black/back.webp',
        side: '/electronics/Apple/iphone-18-pro/black/side.webp',
        top: '/electronics/Apple/iphone-18-pro/black/top.webp',
      },
      'Glacier': {
        front: '/electronics/Apple/iphone-18-pro/glacier/front.webp',
        back: '/electronics/Apple/iphone-18-pro/glacier/back.webp',
        side: '/electronics/Apple/iphone-18-pro/glacier/side.webp',
        top: '/electronics/Apple/iphone-18-pro/glacier/top.webp',
      },
      'Purple': {
        front: '/electronics/Apple/iphone-18-pro/purple/front.webp',
        back: '/electronics/Apple/iphone-18-pro/purple/back.webp',
        side: '/electronics/Apple/iphone-18-pro/purple/side.webp',
        top: '/electronics/Apple/iphone-18-pro/purple/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-18-pro/silver/front.webp',
        back: '/electronics/Apple/iphone-18-pro/silver/back.webp',
        side: '/electronics/Apple/iphone-18-pro/silver/side.webp',
        top: '/electronics/Apple/iphone-18-pro/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-002',
    name: 'iPhone 18 Pro 512GB',
    slug: 'iphone-18-pro-512gb',
    description: 'The iPhone 18 Pro pairs the A20 Pro chip with a ProMotion Super Retina XDR display and an advanced pro camera system. Pro further.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1816.16,
    imageUrl: '/electronics/Apple/iphone-18-pro/black/front.webp',
    colors: ['Black', 'Glacier', 'Purple', 'Silver'],
    colorImages: {
      'Black': {
        front: '/electronics/Apple/iphone-18-pro/black/front.webp',
        back: '/electronics/Apple/iphone-18-pro/black/back.webp',
        side: '/electronics/Apple/iphone-18-pro/black/side.webp',
        top: '/electronics/Apple/iphone-18-pro/black/top.webp',
      },
      'Glacier': {
        front: '/electronics/Apple/iphone-18-pro/glacier/front.webp',
        back: '/electronics/Apple/iphone-18-pro/glacier/back.webp',
        side: '/electronics/Apple/iphone-18-pro/glacier/side.webp',
        top: '/electronics/Apple/iphone-18-pro/glacier/top.webp',
      },
      'Purple': {
        front: '/electronics/Apple/iphone-18-pro/purple/front.webp',
        back: '/electronics/Apple/iphone-18-pro/purple/back.webp',
        side: '/electronics/Apple/iphone-18-pro/purple/side.webp',
        top: '/electronics/Apple/iphone-18-pro/purple/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-18-pro/silver/front.webp',
        back: '/electronics/Apple/iphone-18-pro/silver/back.webp',
        side: '/electronics/Apple/iphone-18-pro/silver/side.webp',
        top: '/electronics/Apple/iphone-18-pro/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-003',
    name: 'iPhone 18 Pro 1TB',
    slug: 'iphone-18-pro-1tb',
    description: 'The iPhone 18 Pro pairs the A20 Pro chip with a ProMotion Super Retina XDR display and an advanced pro camera system. Pro further.',
    category: 'electronics',
    subCategory: 'apple',
    price: 2340.49,
    imageUrl: '/electronics/Apple/iphone-18-pro/black/front.webp',
    colors: ['Black', 'Glacier', 'Purple', 'Silver'],
    colorImages: {
      'Black': {
        front: '/electronics/Apple/iphone-18-pro/black/front.webp',
        back: '/electronics/Apple/iphone-18-pro/black/back.webp',
        side: '/electronics/Apple/iphone-18-pro/black/side.webp',
        top: '/electronics/Apple/iphone-18-pro/black/top.webp',
      },
      'Glacier': {
        front: '/electronics/Apple/iphone-18-pro/glacier/front.webp',
        back: '/electronics/Apple/iphone-18-pro/glacier/back.webp',
        side: '/electronics/Apple/iphone-18-pro/glacier/side.webp',
        top: '/electronics/Apple/iphone-18-pro/glacier/top.webp',
      },
      'Purple': {
        front: '/electronics/Apple/iphone-18-pro/purple/front.webp',
        back: '/electronics/Apple/iphone-18-pro/purple/back.webp',
        side: '/electronics/Apple/iphone-18-pro/purple/side.webp',
        top: '/electronics/Apple/iphone-18-pro/purple/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-18-pro/silver/front.webp',
        back: '/electronics/Apple/iphone-18-pro/silver/back.webp',
        side: '/electronics/Apple/iphone-18-pro/silver/side.webp',
        top: '/electronics/Apple/iphone-18-pro/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-004',
    name: 'iPhone 18 Pro 2TB',
    slug: 'iphone-18-pro-2tb',
    description: 'The iPhone 18 Pro pairs the A20 Pro chip with a ProMotion Super Retina XDR display and an advanced pro camera system. Pro further.',
    category: 'electronics',
    subCategory: 'apple',
    price: 3118.86,
    imageUrl: '/electronics/Apple/iphone-18-pro/black/front.webp',
    colors: ['Black', 'Glacier', 'Purple', 'Silver'],
    colorImages: {
      'Black': {
        front: '/electronics/Apple/iphone-18-pro/black/front.webp',
        back: '/electronics/Apple/iphone-18-pro/black/back.webp',
        side: '/electronics/Apple/iphone-18-pro/black/side.webp',
        top: '/electronics/Apple/iphone-18-pro/black/top.webp',
      },
      'Glacier': {
        front: '/electronics/Apple/iphone-18-pro/glacier/front.webp',
        back: '/electronics/Apple/iphone-18-pro/glacier/back.webp',
        side: '/electronics/Apple/iphone-18-pro/glacier/side.webp',
        top: '/electronics/Apple/iphone-18-pro/glacier/top.webp',
      },
      'Purple': {
        front: '/electronics/Apple/iphone-18-pro/purple/front.webp',
        back: '/electronics/Apple/iphone-18-pro/purple/back.webp',
        side: '/electronics/Apple/iphone-18-pro/purple/side.webp',
        top: '/electronics/Apple/iphone-18-pro/purple/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-18-pro/silver/front.webp',
        back: '/electronics/Apple/iphone-18-pro/silver/back.webp',
        side: '/electronics/Apple/iphone-18-pro/silver/side.webp',
        top: '/electronics/Apple/iphone-18-pro/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-005',
    name: 'iPhone 18 Pro Max 256GB',
    slug: 'iphone-18-pro-max-256gb',
    description: 'The iPhone 18 Pro Max delivers the largest Pro display, A20 Pro power and the most capable pro camera system yet. The ultimate iPhone.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1691.84,
    imageUrl: '/electronics/Apple/iphone-18-pro-max/black/front.webp',
    colors: ['Black', 'Glacier', 'Purple', 'Silver'],
    colorImages: {
      'Black': {
        front: '/electronics/Apple/iphone-18-pro-max/black/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/black/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/black/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/black/top.webp',
      },
      'Glacier': {
        front: '/electronics/Apple/iphone-18-pro-max/glacier/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/glacier/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/glacier/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/glacier/top.webp',
      },
      'Purple': {
        front: '/electronics/Apple/iphone-18-pro-max/purple/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/purple/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/purple/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/purple/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-18-pro-max/silver/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/silver/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/silver/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-006',
    name: 'iPhone 18 Pro Max 512GB',
    slug: 'iphone-18-pro-max-512gb',
    description: 'The iPhone 18 Pro Max delivers the largest Pro display, A20 Pro power and the most capable pro camera system yet. The ultimate iPhone.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1945.89,
    imageUrl: '/electronics/Apple/iphone-18-pro-max/black/front.webp',
    colors: ['Black', 'Glacier', 'Purple', 'Silver'],
    colorImages: {
      'Black': {
        front: '/electronics/Apple/iphone-18-pro-max/black/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/black/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/black/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/black/top.webp',
      },
      'Glacier': {
        front: '/electronics/Apple/iphone-18-pro-max/glacier/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/glacier/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/glacier/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/glacier/top.webp',
      },
      'Purple': {
        front: '/electronics/Apple/iphone-18-pro-max/purple/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/purple/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/purple/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/purple/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-18-pro-max/silver/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/silver/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/silver/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-007',
    name: 'iPhone 18 Pro Max 1TB',
    slug: 'iphone-18-pro-max-1tb',
    description: 'The iPhone 18 Pro Max delivers the largest Pro display, A20 Pro power and the most capable pro camera system yet. The ultimate iPhone.',
    category: 'electronics',
    subCategory: 'apple',
    price: 2470.22,
    imageUrl: '/electronics/Apple/iphone-18-pro-max/black/front.webp',
    colors: ['Black', 'Glacier', 'Purple', 'Silver'],
    colorImages: {
      'Black': {
        front: '/electronics/Apple/iphone-18-pro-max/black/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/black/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/black/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/black/top.webp',
      },
      'Glacier': {
        front: '/electronics/Apple/iphone-18-pro-max/glacier/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/glacier/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/glacier/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/glacier/top.webp',
      },
      'Purple': {
        front: '/electronics/Apple/iphone-18-pro-max/purple/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/purple/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/purple/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/purple/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-18-pro-max/silver/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/silver/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/silver/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-008',
    name: 'iPhone 18 Pro Max 2TB',
    slug: 'iphone-18-pro-max-2tb',
    description: 'The iPhone 18 Pro Max delivers the largest Pro display, A20 Pro power and the most capable pro camera system yet. The ultimate iPhone.',
    category: 'electronics',
    subCategory: 'apple',
    price: 3243.19,
    imageUrl: '/electronics/Apple/iphone-18-pro-max/black/front.webp',
    colors: ['Black', 'Glacier', 'Purple', 'Silver'],
    colorImages: {
      'Black': {
        front: '/electronics/Apple/iphone-18-pro-max/black/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/black/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/black/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/black/top.webp',
      },
      'Glacier': {
        front: '/electronics/Apple/iphone-18-pro-max/glacier/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/glacier/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/glacier/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/glacier/top.webp',
      },
      'Purple': {
        front: '/electronics/Apple/iphone-18-pro-max/purple/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/purple/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/purple/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/purple/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-18-pro-max/silver/front.webp',
        back: '/electronics/Apple/iphone-18-pro-max/silver/back.webp',
        side: '/electronics/Apple/iphone-18-pro-max/silver/side.webp',
        top: '/electronics/Apple/iphone-18-pro-max/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-009',
    name: 'iPhone 17 Pro 256GB',
    slug: 'iphone-17-pro-256gb',
    description: 'iPhone 17 Pro with the A19 Pro chip, ProMotion display and a pro camera system built for creators. Pro-level power in a compact frame.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1351.3,
    imageUrl: '/electronics/Apple/iphone-17-pro/deep-blue/front.webp',
    colors: ['Deep Blue', 'Cosmic Orange', 'Silver'],
    colorImages: {
      'Deep Blue': {
        front: '/electronics/Apple/iphone-17-pro/deep-blue/front.webp',
        back: '/electronics/Apple/iphone-17-pro/deep-blue/back.webp',
        side: '/electronics/Apple/iphone-17-pro/deep-blue/side.webp',
        top: '/electronics/Apple/iphone-17-pro/deep-blue/top.webp',
      },
      'Cosmic Orange': {
        front: '/electronics/Apple/iphone-17-pro/cosmic-orange/front.webp',
        back: '/electronics/Apple/iphone-17-pro/cosmic-orange/back.webp',
        side: '/electronics/Apple/iphone-17-pro/cosmic-orange/side.webp',
        top: '/electronics/Apple/iphone-17-pro/cosmic-orange/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-17-pro/silver/front.webp',
        back: '/electronics/Apple/iphone-17-pro/silver/back.webp',
        side: '/electronics/Apple/iphone-17-pro/silver/side.webp',
        top: '/electronics/Apple/iphone-17-pro/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-010',
    name: 'iPhone 17 Pro 512GB',
    slug: 'iphone-17-pro-512gb',
    description: 'iPhone 17 Pro with the A19 Pro chip, ProMotion display and a pro camera system built for creators. Pro-level power in a compact frame.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1648.59,
    imageUrl: '/electronics/Apple/iphone-17-pro/deep-blue/front.webp',
    colors: ['Deep Blue', 'Cosmic Orange', 'Silver'],
    colorImages: {
      'Deep Blue': {
        front: '/electronics/Apple/iphone-17-pro/deep-blue/front.webp',
        back: '/electronics/Apple/iphone-17-pro/deep-blue/back.webp',
        side: '/electronics/Apple/iphone-17-pro/deep-blue/side.webp',
        top: '/electronics/Apple/iphone-17-pro/deep-blue/top.webp',
      },
      'Cosmic Orange': {
        front: '/electronics/Apple/iphone-17-pro/cosmic-orange/front.webp',
        back: '/electronics/Apple/iphone-17-pro/cosmic-orange/back.webp',
        side: '/electronics/Apple/iphone-17-pro/cosmic-orange/side.webp',
        top: '/electronics/Apple/iphone-17-pro/cosmic-orange/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-17-pro/silver/front.webp',
        back: '/electronics/Apple/iphone-17-pro/silver/back.webp',
        side: '/electronics/Apple/iphone-17-pro/silver/side.webp',
        top: '/electronics/Apple/iphone-17-pro/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-011',
    name: 'iPhone 17 Pro Max 256GB',
    slug: 'iphone-17-pro-max-256gb',
    description: 'iPhone 17 Pro Max with the A19 Pro chip, the biggest Pro display and best-in-class battery life. Everything Pro, supersized.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1513.46,
    imageUrl: '/electronics/Apple/iphone-17-pro-max/deep-blue/front.webp',
    colors: ['Deep Blue', 'Cosmic Orange', 'Silver'],
    colorImages: {
      'Deep Blue': {
        front: '/electronics/Apple/iphone-17-pro-max/deep-blue/front.webp',
        back: '/electronics/Apple/iphone-17-pro-max/deep-blue/back.webp',
        side: '/electronics/Apple/iphone-17-pro-max/deep-blue/side.webp',
        top: '/electronics/Apple/iphone-17-pro-max/deep-blue/top.webp',
      },
      'Cosmic Orange': {
        front: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/front.webp',
        back: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/back.webp',
        side: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/side.webp',
        top: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-17-pro-max/silver/front.webp',
        back: '/electronics/Apple/iphone-17-pro-max/silver/back.webp',
        side: '/electronics/Apple/iphone-17-pro-max/silver/side.webp',
        top: '/electronics/Apple/iphone-17-pro-max/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-012',
    name: 'iPhone 17 Pro Max 512GB',
    slug: 'iphone-17-pro-max-512gb',
    description: 'iPhone 17 Pro Max with the A19 Pro chip, the biggest Pro display and best-in-class battery life. Everything Pro, supersized.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1783.73,
    imageUrl: '/electronics/Apple/iphone-17-pro-max/deep-blue/front.webp',
    colors: ['Deep Blue', 'Cosmic Orange', 'Silver'],
    colorImages: {
      'Deep Blue': {
        front: '/electronics/Apple/iphone-17-pro-max/deep-blue/front.webp',
        back: '/electronics/Apple/iphone-17-pro-max/deep-blue/back.webp',
        side: '/electronics/Apple/iphone-17-pro-max/deep-blue/side.webp',
        top: '/electronics/Apple/iphone-17-pro-max/deep-blue/top.webp',
      },
      'Cosmic Orange': {
        front: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/front.webp',
        back: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/back.webp',
        side: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/side.webp',
        top: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-17-pro-max/silver/front.webp',
        back: '/electronics/Apple/iphone-17-pro-max/silver/back.webp',
        side: '/electronics/Apple/iphone-17-pro-max/silver/side.webp',
        top: '/electronics/Apple/iphone-17-pro-max/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-013',
    name: 'iPhone 17 Pro Max 1TB',
    slug: 'iphone-17-pro-max-1tb',
    description: 'iPhone 17 Pro Max with the A19 Pro chip, the biggest Pro display and best-in-class battery life. Everything Pro, supersized.',
    category: 'electronics',
    subCategory: 'apple',
    price: 2054,
    imageUrl: '/electronics/Apple/iphone-17-pro-max/deep-blue/front.webp',
    colors: ['Deep Blue', 'Cosmic Orange', 'Silver'],
    colorImages: {
      'Deep Blue': {
        front: '/electronics/Apple/iphone-17-pro-max/deep-blue/front.webp',
        back: '/electronics/Apple/iphone-17-pro-max/deep-blue/back.webp',
        side: '/electronics/Apple/iphone-17-pro-max/deep-blue/side.webp',
        top: '/electronics/Apple/iphone-17-pro-max/deep-blue/top.webp',
      },
      'Cosmic Orange': {
        front: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/front.webp',
        back: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/back.webp',
        side: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/side.webp',
        top: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-17-pro-max/silver/front.webp',
        back: '/electronics/Apple/iphone-17-pro-max/silver/back.webp',
        side: '/electronics/Apple/iphone-17-pro-max/silver/side.webp',
        top: '/electronics/Apple/iphone-17-pro-max/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-014',
    name: 'iPhone 17 Pro Max 2TB',
    slug: 'iphone-17-pro-max-2tb',
    description: 'iPhone 17 Pro Max with the A19 Pro chip, the biggest Pro display and best-in-class battery life. Everything Pro, supersized.',
    category: 'electronics',
    subCategory: 'apple',
    price: 2594.54,
    imageUrl: '/electronics/Apple/iphone-17-pro-max/deep-blue/front.webp',
    colors: ['Deep Blue', 'Cosmic Orange', 'Silver'],
    colorImages: {
      'Deep Blue': {
        front: '/electronics/Apple/iphone-17-pro-max/deep-blue/front.webp',
        back: '/electronics/Apple/iphone-17-pro-max/deep-blue/back.webp',
        side: '/electronics/Apple/iphone-17-pro-max/deep-blue/side.webp',
        top: '/electronics/Apple/iphone-17-pro-max/deep-blue/top.webp',
      },
      'Cosmic Orange': {
        front: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/front.webp',
        back: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/back.webp',
        side: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/side.webp',
        top: '/electronics/Apple/iphone-17-pro-max/cosmic-orange/top.webp',
      },
      'Silver': {
        front: '/electronics/Apple/iphone-17-pro-max/silver/front.webp',
        back: '/electronics/Apple/iphone-17-pro-max/silver/back.webp',
        side: '/electronics/Apple/iphone-17-pro-max/silver/side.webp',
        top: '/electronics/Apple/iphone-17-pro-max/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-015',
    name: 'iPhone 17 256GB',
    slug: 'iphone-17-256gb',
    description: 'iPhone 17 brings the A19 chip, a brilliant display and an all-day battery to the everyday iPhone, in a range of vibrant colours.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1178.32,
    imageUrl: '/electronics/Apple/iphone-17/black/front.webp',
    colors: ['Black', 'Lavender', 'Mist Blue', 'Sage', 'White'],
    colorImages: {
      'Black': {
        front: '/electronics/Apple/iphone-17/black/front.webp',
        back: '/electronics/Apple/iphone-17/black/back.webp',
        side: '/electronics/Apple/iphone-17/black/side.webp',
        top: '/electronics/Apple/iphone-17/black/top.webp',
      },
      'Lavender': {
        front: '/electronics/Apple/iphone-17/lavender/front.webp',
        back: '/electronics/Apple/iphone-17/lavender/back.webp',
        side: '/electronics/Apple/iphone-17/lavender/side.webp',
        top: '/electronics/Apple/iphone-17/lavender/top.webp',
      },
      'Mist Blue': {
        front: '/electronics/Apple/iphone-17/mist-blue/front.webp',
        back: '/electronics/Apple/iphone-17/mist-blue/back.webp',
        side: '/electronics/Apple/iphone-17/mist-blue/side.webp',
        top: '/electronics/Apple/iphone-17/mist-blue/top.webp',
      },
      'Sage': {
        front: '/electronics/Apple/iphone-17/sage/front.webp',
        back: '/electronics/Apple/iphone-17/sage/back.webp',
        side: '/electronics/Apple/iphone-17/sage/side.webp',
        top: '/electronics/Apple/iphone-17/sage/top.webp',
      },
      'White': {
        front: '/electronics/Apple/iphone-17/white/front.webp',
        back: '/electronics/Apple/iphone-17/white/back.webp',
        side: '/electronics/Apple/iphone-17/white/side.webp',
        top: '/electronics/Apple/iphone-17/white/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-016',
    name: 'iPhone 17 512GB',
    slug: 'iphone-17-512gb',
    description: 'iPhone 17 brings the A19 chip, a brilliant display and an all-day battery to the everyday iPhone, in a range of vibrant colours.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1378.32,
    imageUrl: '/electronics/Apple/iphone-17/black/front.webp',
    colors: ['Black', 'Lavender', 'Mist Blue', 'Sage', 'White'],
    colorImages: {
      'Black': {
        front: '/electronics/Apple/iphone-17/black/front.webp',
        back: '/electronics/Apple/iphone-17/black/back.webp',
        side: '/electronics/Apple/iphone-17/black/side.webp',
        top: '/electronics/Apple/iphone-17/black/top.webp',
      },
      'Lavender': {
        front: '/electronics/Apple/iphone-17/lavender/front.webp',
        back: '/electronics/Apple/iphone-17/lavender/back.webp',
        side: '/electronics/Apple/iphone-17/lavender/side.webp',
        top: '/electronics/Apple/iphone-17/lavender/top.webp',
      },
      'Mist Blue': {
        front: '/electronics/Apple/iphone-17/mist-blue/front.webp',
        back: '/electronics/Apple/iphone-17/mist-blue/back.webp',
        side: '/electronics/Apple/iphone-17/mist-blue/side.webp',
        top: '/electronics/Apple/iphone-17/mist-blue/top.webp',
      },
      'Sage': {
        front: '/electronics/Apple/iphone-17/sage/front.webp',
        back: '/electronics/Apple/iphone-17/sage/back.webp',
        side: '/electronics/Apple/iphone-17/sage/side.webp',
        top: '/electronics/Apple/iphone-17/sage/top.webp',
      },
      'White': {
        front: '/electronics/Apple/iphone-17/white/front.webp',
        back: '/electronics/Apple/iphone-17/white/back.webp',
        side: '/electronics/Apple/iphone-17/white/side.webp',
        top: '/electronics/Apple/iphone-17/white/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-017',
    name: 'iPad Pro 13-inch 256GB',
    slug: 'ipad-pro-13-256gb',
    description: 'iPad Pro 13-inch with a stunning Ultra Retina XDR display and Apple silicon performance. Built for work, play and everything in between.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1664.81,
    imageUrl: '/electronics/Apple/ipad-pro-13/silver/front.webp',
    colors: ['Silver', 'Space Black'],
    colorImages: {
      'Silver': {
        front: '/electronics/Apple/ipad-pro-13/silver/front.webp',
        back: '/electronics/Apple/ipad-pro-13/silver/back.webp',
        side: '/electronics/Apple/ipad-pro-13/silver/side.webp',
        top: '/electronics/Apple/ipad-pro-13/silver/top.webp',
      },
      'Space Black': {
        front: '/electronics/Apple/ipad-pro-13/space-black/front.webp',
        back: '/electronics/Apple/ipad-pro-13/space-black/back.webp',
        side: '/electronics/Apple/ipad-pro-13/space-black/side.webp',
        top: '/electronics/Apple/ipad-pro-13/space-black/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-018',
    name: 'iPad Pro 13-inch 512GB',
    slug: 'ipad-pro-13-512gb',
    description: 'iPad Pro 13-inch with a stunning Ultra Retina XDR display and Apple silicon performance. Built for work, play and everything in between.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1881.03,
    imageUrl: '/electronics/Apple/ipad-pro-13/silver/front.webp',
    colors: ['Silver', 'Space Black'],
    colorImages: {
      'Silver': {
        front: '/electronics/Apple/ipad-pro-13/silver/front.webp',
        back: '/electronics/Apple/ipad-pro-13/silver/back.webp',
        side: '/electronics/Apple/ipad-pro-13/silver/side.webp',
        top: '/electronics/Apple/ipad-pro-13/silver/top.webp',
      },
      'Space Black': {
        front: '/electronics/Apple/ipad-pro-13/space-black/front.webp',
        back: '/electronics/Apple/ipad-pro-13/space-black/back.webp',
        side: '/electronics/Apple/ipad-pro-13/space-black/side.webp',
        top: '/electronics/Apple/ipad-pro-13/space-black/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-019',
    name: 'iPad Pro 13-inch 1TB',
    slug: 'ipad-pro-13-1tb',
    description: 'iPad Pro 13-inch with a stunning Ultra Retina XDR display and Apple silicon performance. Built for work, play and everything in between.',
    category: 'electronics',
    subCategory: 'apple',
    price: 2324.27,
    imageUrl: '/electronics/Apple/ipad-pro-13/silver/front.webp',
    colors: ['Silver', 'Space Black'],
    colorImages: {
      'Silver': {
        front: '/electronics/Apple/ipad-pro-13/silver/front.webp',
        back: '/electronics/Apple/ipad-pro-13/silver/back.webp',
        side: '/electronics/Apple/ipad-pro-13/silver/side.webp',
        top: '/electronics/Apple/ipad-pro-13/silver/top.webp',
      },
      'Space Black': {
        front: '/electronics/Apple/ipad-pro-13/space-black/front.webp',
        back: '/electronics/Apple/ipad-pro-13/space-black/back.webp',
        side: '/electronics/Apple/ipad-pro-13/space-black/side.webp',
        top: '/electronics/Apple/ipad-pro-13/space-black/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-020',
    name: 'iPad Pro 13-inch 2TB',
    slug: 'ipad-pro-13-2tb',
    description: 'iPad Pro 13-inch with a stunning Ultra Retina XDR display and Apple silicon performance. Built for work, play and everything in between.',
    category: 'electronics',
    subCategory: 'apple',
    price: 2881.03,
    imageUrl: '/electronics/Apple/ipad-pro-13/silver/front.webp',
    colors: ['Silver', 'Space Black'],
    colorImages: {
      'Silver': {
        front: '/electronics/Apple/ipad-pro-13/silver/front.webp',
        back: '/electronics/Apple/ipad-pro-13/silver/back.webp',
        side: '/electronics/Apple/ipad-pro-13/silver/side.webp',
        top: '/electronics/Apple/ipad-pro-13/silver/top.webp',
      },
      'Space Black': {
        front: '/electronics/Apple/ipad-pro-13/space-black/front.webp',
        back: '/electronics/Apple/ipad-pro-13/space-black/back.webp',
        side: '/electronics/Apple/ipad-pro-13/space-black/side.webp',
        top: '/electronics/Apple/ipad-pro-13/space-black/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-021',
    name: 'Apple AirPods Pro 3',
    slug: 'airpods-pro-3',
    description: 'AirPods Pro 3 deliver immersive Active Noise Cancellation, adaptive audio and rich spatial sound in a comfortable, sweat-resistant design.',
    category: 'electronics',
    subCategory: 'apple',
    price: 275.62,
    imageUrl: '/electronics/Apple/airpods-pro-3/white/front.webp',
    colors: ['White'],
    colorImages: {
      'White': {
        front: '/electronics/Apple/airpods-pro-3/white/front.webp',
        back: '/electronics/Apple/airpods-pro-3/white/back.webp',
        side: '/electronics/Apple/airpods-pro-3/white/side.webp',
        top: '/electronics/Apple/airpods-pro-3/white/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-022',
    name: 'Apple Watch Ultra 4 Milanese Loop',
    slug: 'apple-watch-ultra-4-milanese-loop',
    description: 'Apple Watch Ultra 4 with a rugged titanium case, precision GPS and the Milanese Loop. Built for the extremes, worn every day.',
    category: 'electronics',
    subCategory: 'apple',
    price: 1081.03,
    imageUrl: '/electronics/Apple/apple-watch-ultra-4/black/front.webp',
    colors: ['Black Titanium', 'Natural Titanium'],
    colorImages: {
      'Black Titanium': {
        front: '/electronics/Apple/apple-watch-ultra-4/black/front.webp',
        back: '/electronics/Apple/apple-watch-ultra-4/black/back.webp',
        side: '/electronics/Apple/apple-watch-ultra-4/black/side.webp',
        top: '/electronics/Apple/apple-watch-ultra-4/black/top.webp',
      },
      'Natural Titanium': {
        front: '/electronics/Apple/apple-watch-ultra-4/natural/front.webp',
        back: '/electronics/Apple/apple-watch-ultra-4/natural/back.webp',
        side: '/electronics/Apple/apple-watch-ultra-4/natural/side.webp',
        top: '/electronics/Apple/apple-watch-ultra-4/natural/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-023',
    name: 'MacBook Pro 14-inch M5 Pro 24GB / 1TB',
    slug: 'macbook-pro-14-m5-pro-24gb-1tb',
    description: 'MacBook Pro 14-inch with the M5 Pro chip (15-core CPU, 16-core GPU), 24GB unified memory and a 1TB SSD. Serious performance, anywhere.',
    category: 'electronics',
    subCategory: 'apple',
    price: 2756.7,
    imageUrl: '/electronics/Apple/macbook-pro-14-m5-pro/silver/front.webp',
    colors: ['Silver', 'Space Black'],
    colorImages: {
      'Silver': {
        front: '/electronics/Apple/macbook-pro-14-m5-pro/silver/front.webp',
        back: '/electronics/Apple/macbook-pro-14-m5-pro/silver/back.webp',
        side: '/electronics/Apple/macbook-pro-14-m5-pro/silver/side.webp',
        top: '/electronics/Apple/macbook-pro-14-m5-pro/silver/top.webp',
      },
      'Space Black': {
        front: '/electronics/Apple/macbook-pro-14-m5-pro/space-black/front.webp',
        back: '/electronics/Apple/macbook-pro-14-m5-pro/space-black/back.webp',
        side: '/electronics/Apple/macbook-pro-14-m5-pro/space-black/side.webp',
        top: '/electronics/Apple/macbook-pro-14-m5-pro/space-black/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-024',
    name: 'MacBook Pro 14-inch M5 Pro 24GB / 2TB',
    slug: 'macbook-pro-14-m5-pro-24gb-2tb',
    description: 'MacBook Pro 14-inch with the M5 Pro chip (18-core CPU, 20-core GPU), 24GB unified memory and a 2TB SSD. Serious performance, anywhere.',
    category: 'electronics',
    subCategory: 'apple',
    price: 3529.68,
    imageUrl: '/electronics/Apple/macbook-pro-14-m5-pro/silver/front.webp',
    colors: ['Silver', 'Space Black'],
    colorImages: {
      'Silver': {
        front: '/electronics/Apple/macbook-pro-14-m5-pro/silver/front.webp',
        back: '/electronics/Apple/macbook-pro-14-m5-pro/silver/back.webp',
        side: '/electronics/Apple/macbook-pro-14-m5-pro/silver/side.webp',
        top: '/electronics/Apple/macbook-pro-14-m5-pro/silver/top.webp',
      },
      'Space Black': {
        front: '/electronics/Apple/macbook-pro-14-m5-pro/space-black/front.webp',
        back: '/electronics/Apple/macbook-pro-14-m5-pro/space-black/back.webp',
        side: '/electronics/Apple/macbook-pro-14-m5-pro/space-black/side.webp',
        top: '/electronics/Apple/macbook-pro-14-m5-pro/space-black/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-025',
    name: 'MacBook Pro 14-inch M5 Max 36GB / 2TB',
    slug: 'macbook-pro-14-m5-max-36gb-2tb',
    description: 'MacBook Pro 14-inch with the M5 Max chip (18-core CPU, 32-core GPU), 36GB unified memory and a 2TB SSD. The most powerful MacBook Pro.',
    category: 'electronics',
    subCategory: 'apple',
    price: 4529.68,
    imageUrl: '/electronics/Apple/macbook-pro-14-m5-pro/silver/front.webp',
    colors: ['Silver', 'Space Black'],
    colorImages: {
      'Silver': {
        front: '/electronics/Apple/macbook-pro-14-m5-pro/silver/front.webp',
        back: '/electronics/Apple/macbook-pro-14-m5-pro/silver/back.webp',
        side: '/electronics/Apple/macbook-pro-14-m5-pro/silver/side.webp',
        top: '/electronics/Apple/macbook-pro-14-m5-pro/silver/top.webp',
      },
      'Space Black': {
        front: '/electronics/Apple/macbook-pro-14-m5-pro/space-black/front.webp',
        back: '/electronics/Apple/macbook-pro-14-m5-pro/space-black/back.webp',
        side: '/electronics/Apple/macbook-pro-14-m5-pro/space-black/side.webp',
        top: '/electronics/Apple/macbook-pro-14-m5-pro/space-black/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-026',
    name: 'Mac Studio M5 Max 36GB / 512GB',
    slug: 'mac-studio-m5-max-36gb-512gb',
    description: 'Mac Studio with the M5 Max chip (18-core CPU, 32-core GPU), 36GB unified memory and a 512GB SSD. Compact, silent, powerful.',
    category: 'electronics',
    subCategory: 'apple',
    price: 2675.62,
    imageUrl: '/electronics/Apple/mac-studio/silver/front.webp',
    colors: ['Silver'],
    colorImages: {
      'Silver': {
        front: '/electronics/Apple/mac-studio/silver/front.webp',
        back: '/electronics/Apple/mac-studio/silver/back.webp',
        side: '/electronics/Apple/mac-studio/silver/side.webp',
        top: '/electronics/Apple/mac-studio/silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-apple-027',
    name: 'Mac Studio M5 Ultra 96GB / 1TB',
    slug: 'mac-studio-m5-ultra-96gb-1tb',
    description: 'Mac Studio with the M5 Ultra chip (30-core CPU, 64-core GPU), 96GB unified memory and a 1TB SSD. Built for the most demanding workflows.',
    category: 'electronics',
    subCategory: 'apple',
    price: 5891.84,
    imageUrl: '/electronics/Apple/mac-studio/silver/front.webp',
    colors: ['Silver'],
    colorImages: {
      'Silver': {
        front: '/electronics/Apple/mac-studio/silver/front.webp',
        back: '/electronics/Apple/mac-studio/silver/back.webp',
        side: '/electronics/Apple/mac-studio/silver/side.webp',
        top: '/electronics/Apple/mac-studio/silver/top.webp',
      },
    },
  },

  // Samsung Sub-category (12 products)
  // Views per color: front, back, side, top
  {
    id: 'electronics-samsung-001',
    name: 'Samsung Galaxy S26 Ultra 256GB',
    slug: 'samsung-galaxy-s26-ultra-256gb',
    description: 'The ultimate Galaxy with a 200MP pro camera, built-in S Pen, flagship performance and a 6.9-inch Dynamic AMOLED 2X display.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 1675.62,
    imageUrl: '/electronics/Samsung/s26-ultra/black/front.webp',
    colors: ['Black', 'Silver Shadow', 'Pink Gold', 'Cobalt Violet', 'Sky Blue', 'White'],
    colorImages: {
      'Black': {
        front: '/electronics/Samsung/s26-ultra/black/front.webp',
        back: '/electronics/Samsung/s26-ultra/black/back.webp',
        side: '/electronics/Samsung/s26-ultra/black/side.webp',
        top: '/electronics/Samsung/s26-ultra/black/top.webp',
      },
      'Silver Shadow': {
        front: '/electronics/Samsung/s26-ultra/silver-shadow/front.webp',
        back: '/electronics/Samsung/s26-ultra/silver-shadow/back.webp',
        side: '/electronics/Samsung/s26-ultra/silver-shadow/side.webp',
        top: '/electronics/Samsung/s26-ultra/silver-shadow/top.webp',
      },
      'Pink Gold': {
        front: '/electronics/Samsung/s26-ultra/pink-gold/front.webp',
        back: '/electronics/Samsung/s26-ultra/pink-gold/back.webp',
        side: '/electronics/Samsung/s26-ultra/pink-gold/side.webp',
        top: '/electronics/Samsung/s26-ultra/pink-gold/top.webp',
      },
      'Cobalt Violet': {
        front: '/electronics/Samsung/s26-ultra/cobalt-violet/front.webp',
        back: '/electronics/Samsung/s26-ultra/cobalt-violet/back.webp',
        side: '/electronics/Samsung/s26-ultra/cobalt-violet/side.webp',
        top: '/electronics/Samsung/s26-ultra/cobalt-violet/top.webp',
      },
      'Sky Blue': {
        front: '/electronics/Samsung/s26-ultra/sky-blue/front.webp',
        back: '/electronics/Samsung/s26-ultra/sky-blue/back.webp',
        side: '/electronics/Samsung/s26-ultra/sky-blue/side.webp',
        top: '/electronics/Samsung/s26-ultra/sky-blue/top.webp',
      },
      'White': {
        front: '/electronics/Samsung/s26-ultra/white/front.webp',
        back: '/electronics/Samsung/s26-ultra/white/back.webp',
        side: '/electronics/Samsung/s26-ultra/white/side.webp',
        top: '/electronics/Samsung/s26-ultra/white/top.webp',
      },
    },
  },
  {
    id: 'electronics-samsung-002',
    name: 'Samsung Galaxy S26 Ultra 512GB',
    slug: 'samsung-galaxy-s26-ultra-512gb',
    description: 'The ultimate Galaxy with a 200MP pro camera, built-in S Pen, flagship performance and a 6.9-inch Dynamic AMOLED 2X display.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 1945.89,
    imageUrl: '/electronics/Samsung/s26-ultra/black/front.webp',
    colors: ['Black', 'Silver Shadow', 'Pink Gold', 'Cobalt Violet', 'Sky Blue', 'White'],
    colorImages: {
      'Black': {
        front: '/electronics/Samsung/s26-ultra/black/front.webp',
        back: '/electronics/Samsung/s26-ultra/black/back.webp',
        side: '/electronics/Samsung/s26-ultra/black/side.webp',
        top: '/electronics/Samsung/s26-ultra/black/top.webp',
      },
      'Silver Shadow': {
        front: '/electronics/Samsung/s26-ultra/silver-shadow/front.webp',
        back: '/electronics/Samsung/s26-ultra/silver-shadow/back.webp',
        side: '/electronics/Samsung/s26-ultra/silver-shadow/side.webp',
        top: '/electronics/Samsung/s26-ultra/silver-shadow/top.webp',
      },
      'Pink Gold': {
        front: '/electronics/Samsung/s26-ultra/pink-gold/front.webp',
        back: '/electronics/Samsung/s26-ultra/pink-gold/back.webp',
        side: '/electronics/Samsung/s26-ultra/pink-gold/side.webp',
        top: '/electronics/Samsung/s26-ultra/pink-gold/top.webp',
      },
      'Cobalt Violet': {
        front: '/electronics/Samsung/s26-ultra/cobalt-violet/front.webp',
        back: '/electronics/Samsung/s26-ultra/cobalt-violet/back.webp',
        side: '/electronics/Samsung/s26-ultra/cobalt-violet/side.webp',
        top: '/electronics/Samsung/s26-ultra/cobalt-violet/top.webp',
      },
      'Sky Blue': {
        front: '/electronics/Samsung/s26-ultra/sky-blue/front.webp',
        back: '/electronics/Samsung/s26-ultra/sky-blue/back.webp',
        side: '/electronics/Samsung/s26-ultra/sky-blue/side.webp',
        top: '/electronics/Samsung/s26-ultra/sky-blue/top.webp',
      },
      'White': {
        front: '/electronics/Samsung/s26-ultra/white/front.webp',
        back: '/electronics/Samsung/s26-ultra/white/back.webp',
        side: '/electronics/Samsung/s26-ultra/white/side.webp',
        top: '/electronics/Samsung/s26-ultra/white/top.webp',
      },
    },
  },
  {
    id: 'electronics-samsung-003',
    name: 'Samsung Galaxy S26 Ultra 1TB',
    slug: 'samsung-galaxy-s26-ultra-1tb',
    description: 'The ultimate Galaxy with a 200MP pro camera, built-in S Pen, flagship performance and a 6.9-inch Dynamic AMOLED 2X display.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 2351.3,
    imageUrl: '/electronics/Samsung/s26-ultra/black/front.webp',
    colors: ['Black', 'Silver Shadow', 'Pink Gold', 'Cobalt Violet', 'Sky Blue', 'White'],
    colorImages: {
      'Black': {
        front: '/electronics/Samsung/s26-ultra/black/front.webp',
        back: '/electronics/Samsung/s26-ultra/black/back.webp',
        side: '/electronics/Samsung/s26-ultra/black/side.webp',
        top: '/electronics/Samsung/s26-ultra/black/top.webp',
      },
      'Silver Shadow': {
        front: '/electronics/Samsung/s26-ultra/silver-shadow/front.webp',
        back: '/electronics/Samsung/s26-ultra/silver-shadow/back.webp',
        side: '/electronics/Samsung/s26-ultra/silver-shadow/side.webp',
        top: '/electronics/Samsung/s26-ultra/silver-shadow/top.webp',
      },
      'Pink Gold': {
        front: '/electronics/Samsung/s26-ultra/pink-gold/front.webp',
        back: '/electronics/Samsung/s26-ultra/pink-gold/back.webp',
        side: '/electronics/Samsung/s26-ultra/pink-gold/side.webp',
        top: '/electronics/Samsung/s26-ultra/pink-gold/top.webp',
      },
      'Cobalt Violet': {
        front: '/electronics/Samsung/s26-ultra/cobalt-violet/front.webp',
        back: '/electronics/Samsung/s26-ultra/cobalt-violet/back.webp',
        side: '/electronics/Samsung/s26-ultra/cobalt-violet/side.webp',
        top: '/electronics/Samsung/s26-ultra/cobalt-violet/top.webp',
      },
      'Sky Blue': {
        front: '/electronics/Samsung/s26-ultra/sky-blue/front.webp',
        back: '/electronics/Samsung/s26-ultra/sky-blue/back.webp',
        side: '/electronics/Samsung/s26-ultra/sky-blue/side.webp',
        top: '/electronics/Samsung/s26-ultra/sky-blue/top.webp',
      },
      'White': {
        front: '/electronics/Samsung/s26-ultra/white/front.webp',
        back: '/electronics/Samsung/s26-ultra/white/back.webp',
        side: '/electronics/Samsung/s26-ultra/white/side.webp',
        top: '/electronics/Samsung/s26-ultra/white/top.webp',
      },
    },
  },
  {
    id: 'electronics-samsung-004',
    name: 'Samsung Galaxy S26+ 256GB',
    slug: 'samsung-galaxy-s26-plus-256gb',
    description: 'A large-screen flagship pairing a 6.7-inch Dynamic AMOLED 2X display with a pro-grade camera system and all-day battery.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 1405.35,
    imageUrl: '/electronics/Samsung/s26-plus/black/front.webp',
    colors: ['Black', 'Silver Shadow', 'Pink Gold', 'Cobalt Violet', 'Sky Blue', 'White'],
    colorImages: {
      'Black': {
        front: '/electronics/Samsung/s26-plus/black/front.webp',
        back: '/electronics/Samsung/s26-plus/black/back.webp',
        side: '/electronics/Samsung/s26-plus/black/side.webp',
        top: '/electronics/Samsung/s26-plus/black/top.webp',
      },
      'Silver Shadow': {
        front: '/electronics/Samsung/s26-plus/silver-shadow/front.webp',
        back: '/electronics/Samsung/s26-plus/silver-shadow/back.webp',
        side: '/electronics/Samsung/s26-plus/silver-shadow/side.webp',
        top: '/electronics/Samsung/s26-plus/silver-shadow/top.webp',
      },
      'Pink Gold': {
        front: '/electronics/Samsung/s26-plus/pink-gold/front.webp',
        back: '/electronics/Samsung/s26-plus/pink-gold/back.webp',
        side: '/electronics/Samsung/s26-plus/pink-gold/side.webp',
        top: '/electronics/Samsung/s26-plus/pink-gold/top.webp',
      },
      'Cobalt Violet': {
        front: '/electronics/Samsung/s26-plus/cobalt-violet/front.webp',
        back: '/electronics/Samsung/s26-plus/cobalt-violet/back.webp',
        side: '/electronics/Samsung/s26-plus/cobalt-violet/side.webp',
        top: '/electronics/Samsung/s26-plus/cobalt-violet/top.webp',
      },
      'Sky Blue': {
        front: '/electronics/Samsung/s26-plus/sky-blue/front.webp',
        back: '/electronics/Samsung/s26-plus/sky-blue/back.webp',
        side: '/electronics/Samsung/s26-plus/sky-blue/side.webp',
        top: '/electronics/Samsung/s26-plus/sky-blue/top.webp',
      },
      'White': {
        front: '/electronics/Samsung/s26-plus/white/front.webp',
        back: '/electronics/Samsung/s26-plus/white/back.webp',
        side: '/electronics/Samsung/s26-plus/white/side.webp',
        top: '/electronics/Samsung/s26-plus/white/top.webp',
      },
    },
  },
  {
    id: 'electronics-samsung-005',
    name: 'Samsung Galaxy S26+ 512GB',
    slug: 'samsung-galaxy-s26-plus-512gb',
    description: 'A large-screen flagship pairing a 6.7-inch Dynamic AMOLED 2X display with a pro-grade camera system and all-day battery.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 1675.62,
    imageUrl: '/electronics/Samsung/s26-plus/black/front.webp',
    colors: ['Black', 'Silver Shadow', 'Pink Gold', 'Cobalt Violet', 'Sky Blue', 'White'],
    colorImages: {
      'Black': {
        front: '/electronics/Samsung/s26-plus/black/front.webp',
        back: '/electronics/Samsung/s26-plus/black/back.webp',
        side: '/electronics/Samsung/s26-plus/black/side.webp',
        top: '/electronics/Samsung/s26-plus/black/top.webp',
      },
      'Silver Shadow': {
        front: '/electronics/Samsung/s26-plus/silver-shadow/front.webp',
        back: '/electronics/Samsung/s26-plus/silver-shadow/back.webp',
        side: '/electronics/Samsung/s26-plus/silver-shadow/side.webp',
        top: '/electronics/Samsung/s26-plus/silver-shadow/top.webp',
      },
      'Pink Gold': {
        front: '/electronics/Samsung/s26-plus/pink-gold/front.webp',
        back: '/electronics/Samsung/s26-plus/pink-gold/back.webp',
        side: '/electronics/Samsung/s26-plus/pink-gold/side.webp',
        top: '/electronics/Samsung/s26-plus/pink-gold/top.webp',
      },
      'Cobalt Violet': {
        front: '/electronics/Samsung/s26-plus/cobalt-violet/front.webp',
        back: '/electronics/Samsung/s26-plus/cobalt-violet/back.webp',
        side: '/electronics/Samsung/s26-plus/cobalt-violet/side.webp',
        top: '/electronics/Samsung/s26-plus/cobalt-violet/top.webp',
      },
      'Sky Blue': {
        front: '/electronics/Samsung/s26-plus/sky-blue/front.webp',
        back: '/electronics/Samsung/s26-plus/sky-blue/back.webp',
        side: '/electronics/Samsung/s26-plus/sky-blue/side.webp',
        top: '/electronics/Samsung/s26-plus/sky-blue/top.webp',
      },
      'White': {
        front: '/electronics/Samsung/s26-plus/white/front.webp',
        back: '/electronics/Samsung/s26-plus/white/back.webp',
        side: '/electronics/Samsung/s26-plus/white/side.webp',
        top: '/electronics/Samsung/s26-plus/white/top.webp',
      },
    },
  },
  {
    id: 'electronics-samsung-006',
    name: 'Samsung Galaxy S26+ 1TB',
    slug: 'samsung-galaxy-s26-plus-1tb',
    description: 'A large-screen flagship pairing a 6.7-inch Dynamic AMOLED 2X display with a pro-grade camera system and all-day battery.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 1945.89,
    imageUrl: '/electronics/Samsung/s26-plus/black/front.webp',
    colors: ['Black', 'Silver Shadow', 'Pink Gold', 'Cobalt Violet', 'Sky Blue', 'White'],
    colorImages: {
      'Black': {
        front: '/electronics/Samsung/s26-plus/black/front.webp',
        back: '/electronics/Samsung/s26-plus/black/back.webp',
        side: '/electronics/Samsung/s26-plus/black/side.webp',
        top: '/electronics/Samsung/s26-plus/black/top.webp',
      },
      'Silver Shadow': {
        front: '/electronics/Samsung/s26-plus/silver-shadow/front.webp',
        back: '/electronics/Samsung/s26-plus/silver-shadow/back.webp',
        side: '/electronics/Samsung/s26-plus/silver-shadow/side.webp',
        top: '/electronics/Samsung/s26-plus/silver-shadow/top.webp',
      },
      'Pink Gold': {
        front: '/electronics/Samsung/s26-plus/pink-gold/front.webp',
        back: '/electronics/Samsung/s26-plus/pink-gold/back.webp',
        side: '/electronics/Samsung/s26-plus/pink-gold/side.webp',
        top: '/electronics/Samsung/s26-plus/pink-gold/top.webp',
      },
      'Cobalt Violet': {
        front: '/electronics/Samsung/s26-plus/cobalt-violet/front.webp',
        back: '/electronics/Samsung/s26-plus/cobalt-violet/back.webp',
        side: '/electronics/Samsung/s26-plus/cobalt-violet/side.webp',
        top: '/electronics/Samsung/s26-plus/cobalt-violet/top.webp',
      },
      'Sky Blue': {
        front: '/electronics/Samsung/s26-plus/sky-blue/front.webp',
        back: '/electronics/Samsung/s26-plus/sky-blue/back.webp',
        side: '/electronics/Samsung/s26-plus/sky-blue/side.webp',
        top: '/electronics/Samsung/s26-plus/sky-blue/top.webp',
      },
      'White': {
        front: '/electronics/Samsung/s26-plus/white/front.webp',
        back: '/electronics/Samsung/s26-plus/white/back.webp',
        side: '/electronics/Samsung/s26-plus/white/side.webp',
        top: '/electronics/Samsung/s26-plus/white/top.webp',
      },
    },
  },
  {
    id: 'electronics-samsung-007',
    name: 'Samsung Galaxy S26 FE 128GB',
    slug: 'samsung-galaxy-s26-fe-128gb',
    description: 'Fan Edition value with a bright AMOLED display, pro-grade camera and Galaxy AI in a colourful, durable design.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 837.78,
    imageUrl: '/electronics/Samsung/s26-fe/blueberry/front.webp',
    colors: ['Blueberry', 'Graphite'],
    colorImages: {
      'Blueberry': {
        front: '/electronics/Samsung/s26-fe/blueberry/front.webp',
        back: '/electronics/Samsung/s26-fe/blueberry/back.webp',
        side: '/electronics/Samsung/s26-fe/blueberry/side.webp',
        top: '/electronics/Samsung/s26-fe/blueberry/top.webp',
      },
      'Graphite': {
        front: '/electronics/Samsung/s26-fe/graphite/front.webp',
        back: '/electronics/Samsung/s26-fe/graphite/back.webp',
        side: '/electronics/Samsung/s26-fe/graphite/side.webp',
        top: '/electronics/Samsung/s26-fe/graphite/top.webp',
      },
    },
  },
  {
    id: 'electronics-samsung-008',
    name: 'Samsung Galaxy S26 FE 256GB',
    slug: 'samsung-galaxy-s26-fe-256gb',
    description: 'Fan Edition value with a bright AMOLED display, pro-grade camera and Galaxy AI in a colourful, durable design.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 918.86,
    imageUrl: '/electronics/Samsung/s26-fe/blueberry/front.webp',
    colors: ['Blueberry', 'Graphite'],
    colorImages: {
      'Blueberry': {
        front: '/electronics/Samsung/s26-fe/blueberry/front.webp',
        back: '/electronics/Samsung/s26-fe/blueberry/back.webp',
        side: '/electronics/Samsung/s26-fe/blueberry/side.webp',
        top: '/electronics/Samsung/s26-fe/blueberry/top.webp',
      },
      'Graphite': {
        front: '/electronics/Samsung/s26-fe/graphite/front.webp',
        back: '/electronics/Samsung/s26-fe/graphite/back.webp',
        side: '/electronics/Samsung/s26-fe/graphite/side.webp',
        top: '/electronics/Samsung/s26-fe/graphite/top.webp',
      },
    },
  },
  {
    id: 'electronics-samsung-009',
    name: 'Samsung Galaxy Z Fold8 256GB',
    slug: 'samsung-galaxy-z-fold8-256gb',
    description: "Samsung's book-style foldable with a flexible 7.6-inch inner display, refined hinge and multi-window Galaxy AI productivity.",
    category: 'electronics',
    subCategory: 'samsung',
    price: 2216.16,
    imageUrl: '/electronics/Samsung/z-fold8/graphite/front.webp',
    colors: ['Graphite', 'Lavender', 'White'],
    colorImages: {
      'Graphite': {
        front: '/electronics/Samsung/z-fold8/graphite/front.webp',
        back: '/electronics/Samsung/z-fold8/graphite/back.webp',
        side: '/electronics/Samsung/z-fold8/graphite/side.webp',
        top: '/electronics/Samsung/z-fold8/graphite/top.webp',
      },
      'Lavender': {
        front: '/electronics/Samsung/z-fold8/lavender/front.webp',
        back: '/electronics/Samsung/z-fold8/lavender/back.webp',
        side: '/electronics/Samsung/z-fold8/lavender/side.webp',
        top: '/electronics/Samsung/z-fold8/lavender/top.webp',
      },
      'White': {
        front: '/electronics/Samsung/z-fold8/white/front.webp',
        back: '/electronics/Samsung/z-fold8/white/back.webp',
        side: '/electronics/Samsung/z-fold8/white/side.webp',
        top: '/electronics/Samsung/z-fold8/white/top.webp',
      },
    },
  },
  {
    id: 'electronics-samsung-010',
    name: 'Samsung Galaxy Z Fold8 512GB',
    slug: 'samsung-galaxy-z-fold8-512gb',
    description: "Samsung's book-style foldable with a flexible 7.6-inch inner display, refined hinge and multi-window Galaxy AI productivity.",
    category: 'electronics',
    subCategory: 'samsung',
    price: 2486.43,
    imageUrl: '/electronics/Samsung/z-fold8/graphite/front.webp',
    colors: ['Graphite', 'Lavender', 'White'],
    colorImages: {
      'Graphite': {
        front: '/electronics/Samsung/z-fold8/graphite/front.webp',
        back: '/electronics/Samsung/z-fold8/graphite/back.webp',
        side: '/electronics/Samsung/z-fold8/graphite/side.webp',
        top: '/electronics/Samsung/z-fold8/graphite/top.webp',
      },
      'Lavender': {
        front: '/electronics/Samsung/z-fold8/lavender/front.webp',
        back: '/electronics/Samsung/z-fold8/lavender/back.webp',
        side: '/electronics/Samsung/z-fold8/lavender/side.webp',
        top: '/electronics/Samsung/z-fold8/lavender/top.webp',
      },
      'White': {
        front: '/electronics/Samsung/z-fold8/white/front.webp',
        back: '/electronics/Samsung/z-fold8/white/back.webp',
        side: '/electronics/Samsung/z-fold8/white/side.webp',
        top: '/electronics/Samsung/z-fold8/white/top.webp',
      },
    },
  },
  {
    id: 'electronics-samsung-011',
    name: 'Samsung Galaxy Watch Ultra2',
    slug: 'samsung-galaxy-watch-ultra2',
    description: 'Rugged titanium smartwatch with dual-frequency GPS, advanced health sensors, sapphire crystal and long battery life.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 810.76,
    imageUrl: '/electronics/Samsung/watch-ultra2/titanium-grey/front.webp',
    colors: ['Titanium Gray', 'Titanium Silver'],
    colorImages: {
      'Titanium Gray': {
        front: '/electronics/Samsung/watch-ultra2/titanium-grey/front.webp',
        back: '/electronics/Samsung/watch-ultra2/titanium-grey/back.webp',
        side: '/electronics/Samsung/watch-ultra2/titanium-grey/side.webp',
        top: '/electronics/Samsung/watch-ultra2/titanium-grey/top.webp',
      },
      'Titanium Silver': {
        front: '/electronics/Samsung/watch-ultra2/titanium-silver/front.webp',
        back: '/electronics/Samsung/watch-ultra2/titanium-silver/back.webp',
        side: '/electronics/Samsung/watch-ultra2/titanium-silver/side.webp',
        top: '/electronics/Samsung/watch-ultra2/titanium-silver/top.webp',
      },
    },
  },
  {
    id: 'electronics-samsung-012',
    name: 'Samsung Galaxy Buds4 Pro',
    slug: 'samsung-galaxy-buds4-pro',
    description: 'Pro wireless earbuds with intelligent ANC, 360 Audio and clear-call microphones in a compact charging case.',
    category: 'electronics',
    subCategory: 'samsung',
    price: 270.22,
    imageUrl: '/electronics/Samsung/buds4-pro/black/front.webp',
    colors: ['Black', 'Pink Gold', 'White'],
    colorImages: {
      'Black': {
        front: '/electronics/Samsung/buds4-pro/black/front.webp',
        back: '/electronics/Samsung/buds4-pro/black/back.webp',
        side: '/electronics/Samsung/buds4-pro/black/side.webp',
        top: '/electronics/Samsung/buds4-pro/black/top.webp',
      },
      'Pink Gold': {
        front: '/electronics/Samsung/buds4-pro/pink-gold/front.webp',
        back: '/electronics/Samsung/buds4-pro/pink-gold/back.webp',
        side: '/electronics/Samsung/buds4-pro/pink-gold/side.webp',
        top: '/electronics/Samsung/buds4-pro/pink-gold/top.webp',
      },
      'White': {
        front: '/electronics/Samsung/buds4-pro/white/front.webp',
        back: '/electronics/Samsung/buds4-pro/white/back.webp',
        side: '/electronics/Samsung/buds4-pro/white/side.webp',
        top: '/electronics/Samsung/buds4-pro/white/top.webp',
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

