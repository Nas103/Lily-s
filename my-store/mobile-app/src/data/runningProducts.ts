/**
 * Sample Running Shoe Products Data
 * 
 * This file contains sample product data for the Running category.
 * 10 products for men, 10 products for women.
 * 
 * Women's products:
 * - 5 products have 3 colors max with full colorImages structure (front, back, side, top)
 * - 5 products have 1 color but with different side images (front, back, side, top)
 * 
 * TODO: Replace image URLs with actual product images
 * TODO: Update prices, descriptions, and other details as needed
 */

import { Product } from '../types';

export const runningProducts: Product[] = [
  // Men's Running Shoes (10 products)
  {
    id: 'running-men-001',
    name: 'Nike Vaporfly Next% 3',
    slug: 'nike-vaporfly-next-3',
    description: 'Elite racing shoe with ZoomX foam and carbon fiber plate. Designed for speed and efficiency.',
    category: 'running',
    gender: 'men',
    price: 249.99,
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
    id: 'running-men-002',
    name: 'Adidas Adizero Adios Pro 4',
    slug: 'adidas-adizero-adios-pro-4',
    description: 'Premium racing shoe with Lightstrike Pro foam and carbon energy rods for maximum propulsion.',
    category: 'running',
    gender: 'men',
    price: 229.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'White', 'Blue'],
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
      'Blue': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'running-men-003',
    name: 'Brooks Ghost 16',
    slug: 'brooks-ghost-16',
    description: 'Balanced cushioning for smooth transitions. Perfect for daily training and long runs.',
    category: 'running',
    gender: 'men',
    price: 139.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Grey', 'Black', 'Blue'],
    colorImages: {
      'Grey': {
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
      'Blue': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'running-men-004',
    name: 'Asics Gel-Nimbus 26',
    slug: 'asics-gel-nimbus-26',
    description: 'Maximum cushioning with GEL technology. Ideal for neutral runners seeking comfort.',
    category: 'running',
    gender: 'men',
    price: 159.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'White', 'Orange'],
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
      'Orange': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'running-men-005',
    name: 'Saucony Endorphin Speed 4',
    slug: 'saucony-endorphin-speed-4',
    description: 'Lightweight speed trainer with PWRRUN PB foam and nylon plate for responsive rides.',
    category: 'running',
    gender: 'men',
    price: 179.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'White', 'Green'],
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
      'Green': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'running-men-006',
    name: 'Hoka Clifton 10',
    slug: 'hoka-clifton-10',
    description: 'Maximum cushioning with lightweight design. Perfect for long-distance running.',
    category: 'running',
    gender: 'men',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'Blue'],
    colorImages: {
      'Black': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'Blue': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
    },
  },
  {
    id: 'running-men-007',
    name: 'New Balance FuelCell SuperComp Elite v4',
    slug: 'new-balance-fuelcell-supercomp-elite-v4',
    description: 'Elite racing shoe with carbon fiber plate and FuelCell foam for maximum energy return.',
    category: 'running',
    gender: 'men',
    price: 219.99,
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
    id: 'running-men-008',
    name: 'Mizuno Wave Rider 28',
    slug: 'mizuno-wave-rider-28',
    description: 'Smooth ride with Wave technology for stability and cushioning. Great for daily training.',
    category: 'running',
    gender: 'men',
    price: 129.99,
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
    id: 'running-men-009',
    name: 'Under Armour Flow Velociti Elite 2',
    slug: 'under-armour-flow-velociti-elite-2',
    description: 'Lightweight racing shoe with Flow cushioning technology. Built for speed.',
    category: 'running',
    gender: 'men',
    price: 199.99,
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
    id: 'running-men-010',
    name: 'Puma Deviate Nitro Elite 3',
    slug: 'puma-deviate-nitro-elite-3',
    description: 'Elite racing shoe with Nitro foam and carbon fiber plate. Maximum energy return.',
    category: 'running',
    gender: 'men',
    price: 209.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'Orange', 'Blue'],
    colorImages: {
      'Black': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'Orange': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=5', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=6', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=7', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=8', // TODO: Replace
      },
      'Blue': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  
  // Women's Running Shoes (10 products)
  // First 5 with 3 colors
  {
    id: 'running-women-001',
    name: 'Nike Vaporfly Next% 3',
    slug: 'nike-vaporfly-next-3-women',
    description: 'Elite racing shoe with ZoomX foam and carbon fiber plate. Designed for speed and efficiency.',
    category: 'running',
    gender: 'women',
    price: 249.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Pink', 'White', 'Purple'],
    colorImages: {
      'Pink': {
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
      'Purple': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'running-women-002',
    name: 'Adidas Adizero Adios Pro 4',
    slug: 'adidas-adizero-adios-pro-4-women',
    description: 'Premium racing shoe with Lightstrike Pro foam and carbon energy rods for maximum propulsion.',
    category: 'running',
    gender: 'women',
    price: 229.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Pink', 'White', 'Blue'],
    colorImages: {
      'Pink': {
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
      'Blue': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'running-women-003',
    name: 'Brooks Ghost 16',
    slug: 'brooks-ghost-16-women',
    description: 'Balanced cushioning for smooth transitions. Perfect for daily training and long runs.',
    category: 'running',
    gender: 'women',
    price: 139.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Purple', 'Pink', 'Grey'],
    colorImages: {
      'Purple': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
      'Pink': {
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
    id: 'running-women-004',
    name: 'Asics Gel-Nimbus 26',
    slug: 'asics-gel-nimbus-26-women',
    description: 'Maximum cushioning with GEL technology. Ideal for neutral runners seeking comfort.',
    category: 'running',
    gender: 'women',
    price: 159.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Pink', 'White', 'Lavender'],
    colorImages: {
      'Pink': {
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
      'Lavender': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  {
    id: 'running-women-005',
    name: 'Saucony Endorphin Speed 4',
    slug: 'saucony-endorphin-speed-4-women',
    description: 'Lightweight speed trainer with PWRRUN PB foam and nylon plate for responsive rides.',
    category: 'running',
    gender: 'women',
    price: 179.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Pink', 'White', 'Mint'],
    colorImages: {
      'Pink': {
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
      'Mint': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=9', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=10', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=11', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=12', // TODO: Replace
      },
    },
  },
  // Last 5 with 1 color but different side images
  {
    id: 'running-women-006',
    name: 'Hoka Clifton 10',
    slug: 'hoka-clifton-10-women',
    description: 'Maximum cushioning with lightweight design. Perfect for long-distance running.',
    category: 'running',
    gender: 'women',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Pink'],
    colorImages: {
      'Pink': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
    },
  },
  {
    id: 'running-women-007',
    name: 'New Balance FuelCell SuperComp Elite v4',
    slug: 'new-balance-fuelcell-supercomp-elite-v4-women',
    description: 'Elite racing shoe with carbon fiber plate and FuelCell foam for maximum energy return.',
    category: 'running',
    gender: 'women',
    price: 219.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Purple'],
    colorImages: {
      'Purple': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
    },
  },
  {
    id: 'running-women-008',
    name: 'Mizuno Wave Rider 28',
    slug: 'mizuno-wave-rider-28-women',
    description: 'Smooth ride with Wave technology for stability and cushioning. Great for daily training.',
    category: 'running',
    gender: 'women',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Lavender'],
    colorImages: {
      'Lavender': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
    },
  },
  {
    id: 'running-women-009',
    name: 'Under Armour Flow Velociti Elite 2',
    slug: 'under-armour-flow-velociti-elite-2-women',
    description: 'Lightweight racing shoe with Flow cushioning technology. Built for speed.',
    category: 'running',
    gender: 'women',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Mint'],
    colorImages: {
      'Mint': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
    },
  },
  {
    id: 'running-women-010',
    name: 'Puma Deviate Nitro Elite 3',
    slug: 'puma-deviate-nitro-elite-3-women',
    description: 'Elite racing shoe with Nitro foam and carbon fiber plate. Maximum energy return.',
    category: 'running',
    gender: 'women',
    price: 209.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Rose'],
    colorImages: {
      'Rose': {
        front: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // TODO: Replace
        back: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=2', // TODO: Replace
        side: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=3', // TODO: Replace
        top: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&v=4', // TODO: Replace
      },
    },
  },
];

