/**
 * Sample BoxRaw Products Data
 * 
 * This file contains sample product data for the BoxRaw category.
 * Sub-categories: Clothing and Equipment
 * 
 * Clothing (20 products):
 * - 5 products have 2 colors (1 image per color)
 * - 15 products have 1 color only (1 image per color)
 * - No side images needed, just one image per color
 * - Sizes: S, M, L, XL only
 * 
 * Equipment (10 products):
 * - Each product has 1 color only
 * - Each product has 1 image (no side images)
 * - No sizes needed for equipment
 * 
 * TODO: Replace image URLs with actual product images
 * TODO: Update prices, descriptions, and other details as needed
 */

import { Product } from '../types';

export const boxrawProducts: Product[] = [
  // Clothing Sub-category (20 products)
  // First 5 products with 2 colors
  {
    id: 'boxraw-clothing-001',
    name: 'BoxRaw Training Shorts',
    slug: 'boxraw-training-shorts',
    description: 'Premium boxing shorts with moisture-wicking fabric. Perfect for training and sparring sessions.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 49.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy'],
    colorImages: {
      'Black': {
        front: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
        back: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
        side: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
        top: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
      },
      'Navy': {
        front: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image (duplicate for second color)
        back: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
        side: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
        top: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
      },
    },
  },
  {
    id: 'boxraw-clothing-002',
    name: 'BoxRaw Training Jacket',
    slug: 'boxraw-training-jacket',
    description: 'Lightweight training jacket with breathable mesh panels. Ideal for warm-ups and cool-downs.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 79.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Grey'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
      'Grey': {
        front: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image (duplicate for second color)
        back: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
        side: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
        top: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
      },
    },
  },
  {
    id: 'boxraw-clothing-003',
    name: 'BoxRaw Tracksuit',
    slug: 'boxraw-tracksuit',
    description: 'Complete tracksuit set with matching jacket and pants. Premium quality for training and casual wear.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 129.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
      'Navy': {
        front: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image (duplicate for second color)
        back: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
        side: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
        top: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
      },
    },
  },
  {
    id: 'boxraw-clothing-004',
    name: 'BoxRaw Training T-Shirt',
    slug: 'boxraw-training-t-shirt',
    description: 'Moisture-wicking t-shirt designed for intense training sessions. Comfortable and durable.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 39.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
      'White': {
        front: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image (duplicate for second color)
        back: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
        side: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
        top: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
      },
    },
  },
  {
    id: 'boxraw-clothing-005',
    name: 'Sparring Club Label Shorts',
    slug: 'sparring-club-label-shorts',
    description: 'Premium sparring shorts with club label branding. Professional quality for competition.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 59.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Red'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
      'Red': {
        front: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image (duplicate for second color)
        back: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
        side: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
        top: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156',
      },
    },
  },
  // Next 15 products with 1 color only
  {
    id: 'boxraw-clothing-006',
    name: 'Bivol x BoxRaw Shorts',
    slug: 'bivol-x-boxraw-shorts',
    description: 'Exclusive collaboration shorts with Bivol branding. Limited edition design.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 69.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-007',
    name: 'Bivol x BoxRaw T-Shirt',
    slug: 'bivol-x-boxraw-t-shirt',
    description: 'Exclusive collaboration t-shirt with Bivol branding. Premium cotton blend.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 49.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    colorImages: {
      'White': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-008',
    name: 'Bivol x BoxRaw Tracksuit',
    slug: 'bivol-x-boxraw-tracksuit',
    description: 'Exclusive collaboration tracksuit with Bivol branding. Complete matching set.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 149.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy'],
    colorImages: {
      'Navy': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-009',
    name: 'Bivol x BoxRaw Trainers',
    slug: 'bivol-x-boxraw-trainers',
    description: 'Exclusive collaboration trainers with Bivol branding. Premium athletic footwear.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 119.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-010',
    name: 'BoxRaw Competition Shorts',
    slug: 'boxraw-competition-shorts',
    description: 'Professional competition shorts with premium materials. Designed for performance.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 64.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-011',
    name: 'BoxRaw Hooded Jacket',
    slug: 'boxraw-hooded-jacket',
    description: 'Warm hooded jacket perfect for training in cooler conditions. Premium quality.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 89.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Grey'],
    colorImages: {
      'Grey': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-012',
    name: 'BoxRaw Training Pants',
    slug: 'boxraw-training-pants',
    description: 'Flexible training pants with stretch fabric. Perfect for all training activities.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 59.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-013',
    name: 'BoxRaw Tank Top',
    slug: 'boxraw-tank-top',
    description: 'Lightweight tank top for intense training sessions. Breathable and comfortable.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 34.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    colorImages: {
      'White': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-014',
    name: 'BoxRaw Long Sleeve T-Shirt',
    slug: 'boxraw-long-sleeve-t-shirt',
    description: 'Long sleeve training shirt with moisture-wicking technology. Perfect for cooler training.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 44.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy'],
    colorImages: {
      'Navy': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-015',
    name: 'BoxRaw Compression Shorts',
    slug: 'boxraw-compression-shorts',
    description: 'Compression shorts for muscle support and recovery. Advanced fabric technology.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 39.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-016',
    name: 'BoxRaw Training Vest',
    slug: 'boxraw-training-vest',
    description: 'Sleeveless training vest for maximum mobility. Lightweight and breathable.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 42.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Grey'],
    colorImages: {
      'Grey': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-017',
    name: 'BoxRaw Sweatpants',
    slug: 'boxraw-sweatpants',
    description: 'Comfortable sweatpants for training and recovery. Premium cotton blend.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 54.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-018',
    name: 'BoxRaw Polo Shirt',
    slug: 'boxraw-polo-shirt',
    description: 'Classic polo shirt with BoxRaw branding. Perfect for casual training days.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 49.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy'],
    colorImages: {
      'Navy': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-019',
    name: 'BoxRaw Windbreaker',
    slug: 'boxraw-windbreaker',
    description: 'Lightweight windbreaker for outdoor training. Water-resistant and breathable.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 74.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-clothing-020',
    name: 'BoxRaw Training Shorts Pro',
    slug: 'boxraw-training-shorts-pro',
    description: 'Professional grade training shorts with advanced fabric technology. Maximum performance.',
    category: 'boxraw',
    subCategory: 'clothing',
    price: 69.99,
    imageUrl: 'https://boxraw.com/cdn/shop/files/9-BOXRAW_Mens_Genarohoodie_White-5_x1440.jpg?v=1764160156', // BoxRaw clothing product image
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Grey'],
    colorImages: {
      'Grey': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  
  // Equipment Sub-category (10 products)
  // Each product has 1 color and 1 image
  {
    id: 'boxraw-equipment-001',
    name: 'Boxing Hand Wraps',
    slug: 'boxing-hand-wraps',
    description: 'Professional boxing hand wraps for wrist and knuckle protection. 180 inches long, elastic material.',
    category: 'boxraw',
    subCategory: 'equipment',
    price: 14.99,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-equipment-002',
    name: 'Knuckle Protector',
    slug: 'knuckle-protector',
    description: 'Premium knuckle protector for added hand protection during training. Gel padding for maximum comfort.',
    category: 'boxraw',
    subCategory: 'equipment',
    price: 19.99,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image with knuckle protector image
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-equipment-003',
    name: 'Boxing Gloves',
    slug: 'boxraw-boxing-gloves',
    description: 'Professional boxing gloves with premium leather construction. Available in various weights for training.',
    category: 'boxraw',
    subCategory: 'equipment',
    price: 89.99,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image with boxing gloves image
    colors: ['Red'],
    colorImages: {
      'Red': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-equipment-004',
    name: 'Mouthguard',
    slug: 'boxraw-mouthguard',
    description: 'Professional mouthguard for protection during sparring and competition. Customizable fit.',
    category: 'boxraw',
    subCategory: 'equipment',
    price: 24.99,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image with mouthguard image
    colors: ['Clear'],
    colorImages: {
      'Clear': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-equipment-005',
    name: 'Headgear',
    slug: 'boxraw-headgear',
    description: 'Professional boxing headgear with superior padding and ventilation. Adjustable straps for secure fit.',
    category: 'boxraw',
    subCategory: 'equipment',
    price: 79.99,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image with headgear image
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-equipment-006',
    name: 'Shin Guards',
    slug: 'boxraw-shin-guards',
    description: 'Protective shin guards for kickboxing and MMA training. Lightweight and durable construction.',
    category: 'boxraw',
    subCategory: 'equipment',
    price: 49.99,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image with shin guards image
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-equipment-007',
    name: 'Groin Protector',
    slug: 'boxraw-groin-protector',
    description: 'Essential protective gear for sparring and competition. Comfortable and secure fit.',
    category: 'boxraw',
    subCategory: 'equipment',
    price: 34.99,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image with groin protector image
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-equipment-008',
    name: 'Jump Rope',
    slug: 'boxraw-jump-rope',
    description: 'Professional speed jump rope for boxing training. Adjustable length, weighted handles for better control.',
    category: 'boxraw',
    subCategory: 'equipment',
    price: 29.99,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image with jump rope image
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-equipment-009',
    name: 'Focus Pads',
    slug: 'boxraw-focus-pads',
    description: 'Training focus pads for partner drills. Durable construction with comfortable handles.',
    category: 'boxraw',
    subCategory: 'equipment',
    price: 44.99,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image with focus pads image
    colors: ['Red'],
    colorImages: {
      'Red': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
  {
    id: 'boxraw-equipment-010',
    name: 'Punching Bag Gloves',
    slug: 'boxraw-punching-bag-gloves',
    description: 'Specialized gloves for heavy bag training. Extra padding for impact protection.',
    category: 'boxraw',
    subCategory: 'equipment',
    price: 64.99,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image with punching bag gloves image
    colors: ['Black'],
    colorImages: {
      'Black': {
        front: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg', // BoxRaw equipment product image
        back: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        side: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
        top: 'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/L1231809_x500.jpg',
      },
    },
  },
];

