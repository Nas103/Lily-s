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
  // Men's Perfumes (6 items) + Unisex (4 items) - real products
// Men's Perfumes (10 real items)
  {
    id: 'perfume-men-tommy-boy-forever',
    name: 'Tommy Boy Forever Eau de Toilette',
    slug: 'tommy-boy-forever-eau-de-toilette',
    description: 'Aromatic Fougere fragrance for men by Tommy Hilfiger. Top notes: Lemon, Ginger, Black Pepper. Middle: Lavender, Sage, Cinnamon. Base: Driftwood, Musk, Patchouli. Available in 30ml, 50ml and 100ml.',
    category: 'perfumes',
    gender: 'men',
    price: 775.00,
    tags: ['fragrance', 'aromatic-fougere', 'tommy-hilfiger'],
    badge: 'Men',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
  },
  {
    id: 'perfume-men-bad-boy-cobalt-elixir',
    name: 'Carolina Herrera Bad Boy Cobalt Elixir Eau de Parfum',
    slug: 'bad-boy-cobalt-elixir-eau-de-parfum',
    description: 'Aromatic, intense interpretation of BAD BOY Cobalt. Sage, Black Truffle and Resinous Woods with Vanilla and Olibanum. Available in 50ml & 100ml.',
    category: 'perfumes',
    gender: 'men',
    price: 2250.00,
    tags: ['fragrance', 'aromatic', 'woody', 'carolina-herrera'],
    badge: 'Men',
    imageUrl: 'https://images.unsplash.com/photo-1514557179557-9efc4d7949cc?w=800&q=80',
  },
  {
    id: 'perfume-men-k-by-dolce-gabbana',
    name: 'K by Dolce&Gabbana Eau de Toilette',
    slug: 'k-by-dolce-gabbana-eau-de-toilette',
    description: 'Celebrates a new era of masculinity with citrus freshness, Sicilian lemon, blood orange, juniper berry, cedarwood, green vetiver, patchouli and pimiento essence. Available in 50ml, 100ml and 150ml.',
    category: 'perfumes',
    gender: 'men',
    price: 2150.00,
    tags: ['fragrance', 'citrus', 'woody', 'dolce-gabbana'],
    badge: 'Men',
    imageUrl: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800&q=80',
  },
  {
    id: 'perfume-men-hugo-man',
    name: 'Hugo Man Eau de Toilette',
    slug: 'hugo-man-eau-de-toilette',
    description: 'Green Apple, Aromatic Notes and Fir Balsam. Available in 75ml, 125ml and 200ml. HUGO Man captures a free-spirited attitude.',
    category: 'perfumes',
    gender: 'men',
    price: 2720.00,
    tags: ['fragrance', 'aromatic', 'fresh', 'hugo-boss'],
    badge: 'Men',
    imageUrl: 'https://images.unsplash.com/photo-1610461888750-10bfc601b874?w=800&q=80',
  },
  {
    id: 'perfume-men-stronger-with-you-absolutely',
    name: 'Emporio Armani Stronger With You Absolutely Parfum',
    slug: 'emprorio-armani-stronger-with-you-absolutely-parfum',
    description: 'Refined masculine parfum with addictive rum accord, lavender, vanilla and smoky cedarwood. Available in 50ml and 100ml.',
    category: 'perfumes',
    gender: 'men',
    price: 2000.00,
    tags: ['fragrance', 'parfum', 'woody-amber', 'armani'],
    badge: 'Men',
    imageUrl: 'https://images.unsplash.com/photo-1617224793032-9f29d4b6f5e3?w=800&q=80',
  },
  {
    id: 'perfume-men-myslf',
    name: 'Yves Saint Laurent MYSLF Eau de Parfum',
    slug: 'ysl-myslf-eau-de-parfum',
    description: 'Woody floral fragrance with bergamot, orange blossom absolute and warm woods including Indonesian patchouli and Ambrofix. Available in 60ml & 100ml.',
    category: 'perfumes',
    gender: 'men',
    price: 3000.00,
    tags: ['fragrance', 'woody-floral', 'ysl'],
    badge: 'Men',
    imageUrl: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80',
  },
  {
    id: 'perfume-unisex-heritage',
    name: 'Fragrance Du Bois Heritage Parfum',
    slug: 'fragrance-du-bois-heritage-parfum',
    description: 'Heritage Parfum from Fragrance Du Bois. Unisex/statement fragrance.',
    category: 'perfumes',
    gender: 'unisex',
    price: 10808.44,
    tags: ['fragrance', 'parfum', 'unisex'],
    badge: 'Unisex',
    imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59cbe?w=800&q=80',
  },
  {
    id: 'perfume-unisex-amouage-outlands',
    name: 'Amouage Outlands Eau de Parfum',
    slug: 'amouage-outlands-eau-de-parfum',
    description: 'Amouage Outlands EDP, 100ml.',
    category: 'perfumes',
    gender: 'unisex',
    price: 7908.18,
    tags: ['fragrance', 'parfum', 'unisex', 'amouage'],
    badge: 'Unisex',
    imageUrl: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&q=80',
  },
  {
    id: 'perfume-unisex-roja-united-arab-emirates',
    name: 'Roja United Arab Emirates Parfum',
    slug: 'roja-united-arab-emirates-parfum',
    description: 'Roja UAE Parfum.',
    category: 'perfumes',
    gender: 'unisex',
    price: 9457.39,
    tags: ['fragrance', 'parfum', 'unisex', 'roja'],
    badge: 'Unisex',
    imageUrl: 'https://images.unsplash.com/photo-1618557031831-8e1c0d6b7c85?w=800&q=80',
  },
  {
    id: 'perfume-unisex-xerjoff-5-five-white',
    name: 'Xerjoff 5 Five White Eau de Parfum - UAE Exclusive',
    slug: 'xerjoff-5-five-white-eau-de-parfum-uae-exclusive',
    description: 'Xerjoff 5 Five White Eau de Parfum - UAE Exclusive Dubai Boutique Edition, 100ml.',
    category: 'perfumes',
    gender: 'unisex',
    price: 12159.50,
    tags: ['fragrance', 'parfum', 'unisex', 'xerjoff'],
    badge: 'Unisex',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80',
  },
];


