/**
 * Perfumes Products Data
 * 
 * This file contains product data for the Perfumes category.
 * - Men's Perfumes: 15 products
 * - Women's Perfumes: 20 products
 * - Each product has 1 image
 * 
 * TODO: Replace image URLs with local storage paths when images are uploaded
 * Image paths should be: assets/images/products/perfumes/men/product-XXX/main.jpg
 *                        assets/images/products/perfumes/women/product-XXX/main.jpg
 */

import { Product } from '../types';

export const perfumesProducts: Product[] = [
  // Men's Perfumes (15 products)
  // TODO: Replace all product details (name, description, price) with actual information
  {
    id: 'perfume-men-001',
    name: 'Premium Men\'s Cologne',
    slug: 'premium-mens-cologne',
    description: 'A sophisticated and bold fragrance for the modern man. Notes of bergamot, cedarwood, and amber.',
    category: 'perfumes',
    gender: 'men',
    price: 89.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-001/main.jpg
  },
  {
    id: 'perfume-men-002',
    name: 'Classic Men\'s Eau de Toilette',
    slug: 'classic-mens-eau-de-toilette',
    description: 'Timeless elegance with notes of citrus, lavender, and musk. Perfect for everyday wear.',
    category: 'perfumes',
    gender: 'men',
    price: 79.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-002/main.jpg
  },
  {
    id: 'perfume-men-003',
    name: 'Luxury Men\'s Fragrance',
    slug: 'luxury-mens-fragrance',
    description: 'A rich and opulent scent featuring oud, sandalwood, and vanilla. For special occasions.',
    category: 'perfumes',
    gender: 'men',
    price: 129.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-003/main.jpg
  },
  {
    id: 'perfume-men-004',
    name: 'Fresh Men\'s Aftershave',
    slug: 'fresh-mens-aftershave',
    description: 'Crisp and invigorating with mint, eucalyptus, and sea salt notes. Ideal for morning routines.',
    category: 'perfumes',
    gender: 'men',
    price: 69.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-004/main.jpg
  },
  {
    id: 'perfume-men-005',
    name: 'Bold Men\'s Parfum',
    slug: 'bold-mens-parfum',
    description: 'Powerful and confident with black pepper, leather, and tobacco. Makes a statement.',
    category: 'perfumes',
    gender: 'men',
    price: 99.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-005/main.jpg
  },
  {
    id: 'perfume-men-006',
    name: 'Sport Men\'s Cologne',
    slug: 'sport-mens-cologne',
    description: 'Energetic and dynamic with citrus, green apple, and aquatic notes. Perfect for active lifestyles.',
    category: 'perfumes',
    gender: 'men',
    price: 59.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-006/main.jpg
  },
  {
    id: 'perfume-men-007',
    name: 'Woody Men\'s Fragrance',
    slug: 'woody-mens-fragrance',
    description: 'Warm and earthy with cedar, patchouli, and vetiver. A sophisticated choice for evening wear.',
    category: 'perfumes',
    gender: 'men',
    price: 94.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-007/main.jpg
  },
  {
    id: 'perfume-men-008',
    name: 'Citrus Men\'s Eau de Cologne',
    slug: 'citrus-mens-eau-de-cologne',
    description: 'Bright and refreshing with lemon, orange, and grapefruit. Energizing and uplifting.',
    category: 'perfumes',
    gender: 'men',
    price: 74.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-008/main.jpg
  },
  {
    id: 'perfume-men-009',
    name: 'Spicy Men\'s Parfum',
    slug: 'spicy-mens-parfum',
    description: 'Intense and warming with cinnamon, cardamom, and clove. Bold and memorable.',
    category: 'perfumes',
    gender: 'men',
    price: 109.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-009/main.jpg
  },
  {
    id: 'perfume-men-010',
    name: 'Aquatic Men\'s Fragrance',
    slug: 'aquatic-mens-fragrance',
    description: 'Fresh and clean with marine notes, calone, and white musk. Like a breath of ocean air.',
    category: 'perfumes',
    gender: 'men',
    price: 84.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-010/main.jpg
  },
  {
    id: 'perfume-men-011',
    name: 'Oriental Men\'s Cologne',
    slug: 'oriental-mens-cologne',
    description: 'Exotic and mysterious with amber, incense, and myrrh. A unique and captivating scent.',
    category: 'perfumes',
    gender: 'men',
    price: 119.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-011/main.jpg
  },
  {
    id: 'perfume-men-012',
    name: 'Fougère Men\'s Fragrance',
    slug: 'fougere-mens-fragrance',
    description: 'Classic barbershop scent with lavender, coumarin, and oakmoss. Timeless and refined.',
    category: 'perfumes',
    gender: 'men',
    price: 89.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-012/main.jpg
  },
  {
    id: 'perfume-men-013',
    name: 'Gourmand Men\'s Parfum',
    slug: 'gourmand-mens-parfum',
    description: 'Sweet and indulgent with vanilla, caramel, and tonka bean. Comforting and luxurious.',
    category: 'perfumes',
    gender: 'men',
    price: 104.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-013/main.jpg
  },
  {
    id: 'perfume-men-014',
    name: 'Herbal Men\'s Eau de Toilette',
    slug: 'herbal-mens-eau-de-toilette',
    description: 'Natural and green with sage, rosemary, and thyme. Fresh and invigorating.',
    category: 'perfumes',
    gender: 'men',
    price: 79.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-014/main.jpg
  },
  {
    id: 'perfume-men-015',
    name: 'Leather Men\'s Cologne',
    slug: 'leather-mens-cologne',
    description: 'Bold and rugged with leather, birch tar, and suede. Masculine and powerful.',
    category: 'perfumes',
    gender: 'men',
    price: 114.99,
    imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0', // TODO: Replace with assets/images/products/perfumes/men/product-015/main.jpg
  },

  // Women's Perfumes (20 products)
  // TODO: Replace all product details (name, description, price) with actual information
  {
    id: 'perfume-women-001',
    name: 'Floral Women\'s Perfume',
    slug: 'floral-womens-perfume',
    description: 'Delicate and feminine with rose, jasmine, and peony. A classic floral bouquet.',
    category: 'perfumes',
    gender: 'women',
    price: 89.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-001/main.jpg
  },
  {
    id: 'perfume-women-002',
    name: 'Fruity Women\'s Eau de Parfum',
    slug: 'fruity-womens-eau-de-parfum',
    description: 'Sweet and playful with peach, strawberry, and raspberry. Youthful and vibrant.',
    category: 'perfumes',
    gender: 'women',
    price: 79.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-002/main.jpg
  },
  {
    id: 'perfume-women-003',
    name: 'Oriental Women\'s Fragrance',
    slug: 'oriental-womens-fragrance',
    description: 'Exotic and sensual with vanilla, patchouli, and amber. Mysterious and alluring.',
    category: 'perfumes',
    gender: 'women',
    price: 119.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-003/main.jpg
  },
  {
    id: 'perfume-women-004',
    name: 'Fresh Women\'s Perfume',
    slug: 'fresh-womens-perfume',
    description: 'Light and airy with citrus, white flowers, and green notes. Perfect for daytime.',
    category: 'perfumes',
    gender: 'women',
    price: 74.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-004/main.jpg
  },
  {
    id: 'perfume-women-005',
    name: 'Gourmand Women\'s Parfum',
    slug: 'gourmand-womens-parfum',
    description: 'Sweet and indulgent with caramel, chocolate, and vanilla. Irresistibly delicious.',
    category: 'perfumes',
    gender: 'women',
    price: 99.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-005/main.jpg
  },
  {
    id: 'perfume-women-006',
    name: 'Woody Women\'s Eau de Parfum',
    slug: 'woody-womens-eau-de-parfum',
    description: 'Warm and sophisticated with sandalwood, cedar, and vetiver. Modern and elegant.',
    category: 'perfumes',
    gender: 'women',
    price: 109.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-006/main.jpg
  },
  {
    id: 'perfume-women-007',
    name: 'Chypre Women\'s Fragrance',
    slug: 'chypre-womens-fragrance',
    description: 'Classic and timeless with bergamot, rose, and oakmoss. A sophisticated choice.',
    category: 'perfumes',
    gender: 'women',
    price: 124.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-007/main.jpg
  },
  {
    id: 'perfume-women-008',
    name: 'Aquatic Women\'s Perfume',
    slug: 'aquatic-womens-perfume',
    description: 'Fresh and clean with water lily, sea salt, and white musk. Like a sea breeze.',
    category: 'perfumes',
    gender: 'women',
    price: 84.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-008/main.jpg
  },
  {
    id: 'perfume-women-009',
    name: 'Powdery Women\'s Eau de Toilette',
    slug: 'powdery-womens-eau-de-toilette',
    description: 'Soft and comforting with iris, violet, and heliotrope. Delicate and feminine.',
    category: 'perfumes',
    gender: 'women',
    price: 69.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-009/main.jpg
  },
  {
    id: 'perfume-women-010',
    name: 'Spicy Women\'s Parfum',
    slug: 'spicy-womens-parfum',
    description: 'Warm and inviting with cinnamon, clove, and pink pepper. Bold and confident.',
    category: 'perfumes',
    gender: 'women',
    price: 114.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-010/main.jpg
  },
  {
    id: 'perfume-women-011',
    name: 'Green Women\'s Fragrance',
    slug: 'green-womens-fragrance',
    description: 'Natural and fresh with green tea, bamboo, and mint. Crisp and energizing.',
    category: 'perfumes',
    gender: 'women',
    price: 94.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-011/main.jpg
  },
  {
    id: 'perfume-women-012',
    name: 'Aldehydic Women\'s Perfume',
    slug: 'aldehydic-womens-perfume',
    description: 'Sparkling and effervescent with aldehydes, jasmine, and ylang-ylang. Classic elegance.',
    category: 'perfumes',
    gender: 'women',
    price: 129.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-012/main.jpg
  },
  {
    id: 'perfume-women-013',
    name: 'Musk Women\'s Eau de Parfum',
    slug: 'musk-womens-eau-de-parfum',
    description: 'Sensual and intimate with white musk, cashmere, and soft florals. Subtle and alluring.',
    category: 'perfumes',
    gender: 'women',
    price: 104.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-013/main.jpg
  },
  {
    id: 'perfume-women-014',
    name: 'Fruity Floral Women\'s Fragrance',
    slug: 'fruity-floral-womens-fragrance',
    description: 'A perfect blend of sweet fruits and delicate flowers. Playful and romantic.',
    category: 'perfumes',
    gender: 'women',
    price: 89.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-014/main.jpg
  },
  {
    id: 'perfume-women-015',
    name: 'Tropical Women\'s Perfume',
    slug: 'tropical-womens-perfume',
    description: 'Exotic and vibrant with coconut, mango, and hibiscus. A vacation in a bottle.',
    category: 'perfumes',
    gender: 'women',
    price: 79.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-015/main.jpg
  },
  {
    id: 'perfume-women-016',
    name: 'Rose Women\'s Eau de Parfum',
    slug: 'rose-womens-eau-de-parfum',
    description: 'Romantic and timeless with Bulgarian rose, peony, and violet. The essence of femininity.',
    category: 'perfumes',
    gender: 'women',
    price: 119.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-016/main.jpg
  },
  {
    id: 'perfume-women-017',
    name: 'Lavender Women\'s Fragrance',
    slug: 'lavender-womens-fragrance',
    description: 'Calming and soothing with lavender, chamomile, and vanilla. Peaceful and serene.',
    category: 'perfumes',
    gender: 'women',
    price: 74.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-017/main.jpg
  },
  {
    id: 'perfume-women-018',
    name: 'Citrus Women\'s Perfume',
    slug: 'citrus-womens-perfume',
    description: 'Bright and energizing with lemon, bergamot, and grapefruit. Fresh and uplifting.',
    category: 'perfumes',
    gender: 'women',
    price: 69.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-018/main.jpg
  },
  {
    id: 'perfume-women-019',
    name: 'Amber Women\'s Eau de Parfum',
    slug: 'amber-womens-eau-de-parfum',
    description: 'Warm and golden with amber, labdanum, and vanilla. Luxurious and comforting.',
    category: 'perfumes',
    gender: 'women',
    price: 134.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-019/main.jpg
  },
  {
    id: 'perfume-women-020',
    name: 'Gardenia Women\'s Fragrance',
    slug: 'gardenia-womens-fragrance',
    description: 'Rich and intoxicating with gardenia, tuberose, and jasmine. Bold and unforgettable.',
    category: 'perfumes',
    gender: 'women',
    price: 109.99,
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', // TODO: Replace with assets/images/products/perfumes/women/product-020/main.jpg
  },
];

