/**
 * Women's Modest-Wear Products (El Huyam + Black Modesty)
 *
 * 10 real products backed by local images under /public/women/<slug>/<color>/.
 * Source prices were given in EUR (El Huyam) and EGP (Black Modesty) and have
 * been converted to the store's USD base (EUR via 1 USD = 0.92, EGP via
 * 1 USD = 52.0). Images are jpg (converted from the webp/png sources) so they
 * render natively in React Native.
 */

import { Product } from '../types';

const imageSet = (slug: string, colorFolder: string, version?: number) => {
  const suffix = version ? `?v=${version}` : "";
  return {
    front: `/women/${slug}/${colorFolder}/main.jpg${suffix}`,
    back: `/women/${slug}/${colorFolder}/2.jpg${suffix}`,
    side: `/women/${slug}/${colorFolder}/3.jpg${suffix}`,
    top: `/women/${slug}/${colorFolder}/4.jpg${suffix}`,
  };
};

export const womenProducts: Product[] = [
  {
    id: 'women-el-huyam-ghashwa-niqab-midnight-navy',
    name: 'Midnight Navy Ghashwa Niqab Set',
    slug: 'ghashwa-niqab-midnight-navy',
    description:
      'Elevate your modest wardrobe with our Midnight Navy Ghashwa Niqab Set, crafted from premium lightweight chiffon for a beautifully soft and elegant drape. This coordinated set includes a flowing ghashwa niqab and a matching 2-meter chiffon scarf with a comfortable built-in elastic band, ensuring a secure fit and effortless wear. Designed to provide graceful full coverage while remaining breathable and lightweight, this set is perfect for everyday wear and special occasions. The rich midnight navy shade adds a timeless touch of sophistication to any modest wardrobe.\n\nProduct details:\n* Premium lightweight chiffon\n* Matching ghashwa niqab and scarf\n* Scarf with built-in elastic band for a secure and comfortable fit\n* Soft, breathable & lightweight\n* Elegant flowing drape\n* Full coverage with exceptional comfort\n* Ghashwa Dimensions: 200 × 75 cm (2 m × 75 cm)\n* Niqab Length: 50 cm\n* Suitable for everyday wear and special occasions\n* Color: Midnight Navy',
    highlight: 'Premium lightweight chiffon ghashwa niqab and matching scarf.',
    category: 'women',
    gender: 'women',
    price: 21.74,
    colors: ['Midnight Navy'],
    colorImages: {
      'Midnight Navy': imageSet('ghashwa-niqab-midnight-navy', 'midnight-navy'),
    },
    tags: ['women', 'niqab', 'ghashwa', 'chiffon', 'modest', 'el-huyam'],
    badge: 'El Huyam',
    imageUrl: '/women/ghashwa-niqab-midnight-navy/midnight-navy/main.jpg',
  },
  {
    id: 'women-el-huyam-ghashwa-niqab-sage-green',
    name: 'Sage Green Ghashwa Niqab Set',
    slug: 'ghashwa-niqab-sage-green',
    description:
      'A coordinated ghashwa niqab set in a soft sage green, crafted from premium lightweight chiffon for a beautifully soft and elegant drape. The set includes a flowing ghashwa niqab and a matching 2-meter chiffon scarf with a built-in elastic band for a secure and comfortable fit. Breathable, lightweight and perfect for everyday wear and special occasions.\n\nProduct details:\n* Premium lightweight chiffon\n* Matching ghashwa niqab and scarf\n* Scarf with built-in elastic band\n* Soft, breathable & lightweight\n* Ghashwa Dimensions: 200 × 75 cm\n* Niqab Length: 50 cm\n* Color: Sage Green',
    highlight: 'Premium lightweight chiffon ghashwa niqab set in sage green.',
    category: 'women',
    gender: 'women',
    price: 21.74,
    colors: ['Sage Green'],
    colorImages: {
      'Sage Green': imageSet('ghashwa-niqab-sage-green', 'sage-green'),
    },
    tags: ['women', 'niqab', 'ghashwa', 'chiffon', 'modest', 'el-huyam'],
    badge: 'El Huyam',
    imageUrl: '/women/ghashwa-niqab-sage-green/sage-green/main.jpg',
  },
  {
    id: 'women-el-huyam-abaya-fatima-off-white',
    name: 'Abaya Fatima Set — Off White',
    slug: 'abaya-fatima-off-white',
    description:
      'The Abaya Fatima Set — Off White is designed for a modern, elegant and effortlessly modest look. Made from high-quality Crepe SPH, it features an extra-wide, loose and beautifully flowing abaya for maximum comfort and graceful movement. The set comes with a matching Khimar Ghashwa, featuring a triangular design with elastic for a comfortable and secure fit.\n\nDetails:\n* Color: Off White\n* Fabric: Premium Crepe SPH\n* Abaya: Extra-wide, loose & flowy\n* Khimar Ghashwa: Triangular design with elastic\n* Size 1: 140 cm abaya length (S, M)\n* Size 2: 155 cm abaya length (L, XL)\n* Width is the same for both sizes — only the length differs\n\nطقم عباية فاطمة — أوف وايت بتصميم عصري وأنيق يمنحك إطلالة محتشمة وراقية. مصنوعة من قماش كريب SPH عالي الجودة، وتتميز العباية بقصة واسعة جدًا وانسيابية. يأتي الطقم مع خمار غشوة متناسق بتصميم مثلث، مزود بإيلاستيك لثبات مريح ولبس عملي.',
    highlight: 'Extra-wide flowing Crepe SPH abaya with matching khimar ghashwa.',
    category: 'women',
    gender: 'women',
    price: 48.91,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Off White'],
    colorImages: {
      'Off White': imageSet('abaya-fatima-off-white', 'off-white'),
    },
    tags: ['women', 'abaya', 'khimar', 'crepe', 'modest', 'el-huyam'],
    badge: 'El Huyam',
    imageUrl: '/women/abaya-fatima-off-white/off-white/main.jpg',
  },
  {
    id: 'women-el-huyam-abaya-maria-midnight-black',
    name: 'Abaya Maria — Midnight Black (2-Piece)',
    slug: 'abaya-maria-midnight-black',
    description:
      'A beautifully crafted two-piece abaya designed with a graceful flowing silhouette that embodies timeless elegance and modesty. Made from premium lightweight, breathable fabric, it offers exceptional comfort with a luxurious drape — perfect for everyday wear, travel, gatherings, and special occasions.\n\nSpecifications:\n* Size one (36, 38, 40, 42) < 1.65 m\n* Size two (44, 46, 48, 50, 52) > 1.65 m\n\nFeatures:\n* Premium lightweight, breathable fabric\n* Elegant two-piece design\n* Front tie closure\n* Relaxed, loose-fit silhouette\n* Wide flowing sleeves with fitted inner cuffs\n* Soft, graceful drape\n* Suitable for all seasons',
    highlight: 'Two-piece abaya with front tie closure and wide flowing sleeves.',
    category: 'women',
    gender: 'women',
    price: 43.48,
    sizes: ['36', '38', '40', '42', '44', '46', '48', '50', '52'],
    colors: ['Midnight Black'],
    colorImages: {
      'Midnight Black': imageSet('abaya-maria-midnight-black', 'midnight-black'),
    },
    tags: ['women', 'abaya', '2-piece', 'modest', 'el-huyam'],
    badge: 'El Huyam',
    imageUrl: '/women/abaya-maria-midnight-black/midnight-black/main.jpg',
  },
  {
    id: 'women-el-huyam-joury-ivory-skirt-set',
    name: 'Jouri Ivory Skirt Set',
    slug: 'joury-ivory-skirt-set',
    description:
      'The Jouri Set in Ivory, featuring a long top and a long skirt. The top is 155 cm long with side openings and wide sleeves featuring two adjustable ties on each sleeve, which can be tied or left to hang loose. The skirt has an elastic waistband for comfort. Made from Crêpe Zara.\n\nطقم جوري باللون العاجي (Ivory)، مكوّن من توب طويل وتنورة طويلة. التوب بطول 155 سم مع فتحات جانبية، وأكمام واسعة بتفصيلة خيطين عند كل كم يمكن ربطهما أو تركهما منسدلين. التنورة بخصر إلاستيك لراحة أفضل. مصنوع من Crêpe Zara.\n\n* Size 1: < 165 cm (S/M)\n* Size 2: > 165 cm (L/XL)',
    highlight: 'Long top and skirt set in Crêpe Zara with adjustable sleeve ties.',
    category: 'women',
    gender: 'women',
    price: 59.78,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Ivory'],
    colorImages: {
      Ivory: imageSet('joury-ivory-skirt-set', 'ivory'),
    },
    tags: ['women', 'skirt-set', 'crepe-zara', 'modest', 'el-huyam'],
    badge: 'El Huyam',
    imageUrl: '/women/joury-ivory-skirt-set/ivory/main.jpg',
  },
  {
    id: 'women-black-modesty-circular-khimar-ruffle-satin',
    name: 'Circular Khimar "Ghashwa" — Soft Ruffle & Satin Ribbon',
    slug: 'circular-khimar-ruffle-satin',
    description:
      'A modest circular khimar featuring soft ruffle (karneesha) edges and a delicate satin ribbon, adding a refined, elegant touch while maintaining modesty. Made from lightweight, soft chiffon fabric — offering all-day comfort and full coverage. Complete coverage, insha\'Allah… with a style that reflects your identity.\n\nAvailable styles: Plain Edge, Narrow Satin Trim, Wide Satin Trim, Ruffle Edge.',
    highlight: 'Circular khimar with soft ruffle edges and a satin ribbon.',
    category: 'women',
    gender: 'women',
    price: 33.65,
    sizes: ['125cm', '150cm', '125cm + Elastic', '150cm + Elastic'],
    colors: ['Black'],
    colorImages: {
      Black: imageSet('circular-khimar-ruffle-satin', 'black'),
    },
    tags: ['women', 'khimar', 'ghashwa', 'chiffon', 'modest', 'black-modesty'],
    badge: 'Black Modesty',
    imageUrl: '/women/circular-khimar-ruffle-satin/black/main.jpg',
  },
  {
    id: 'women-black-modesty-circular-khimar-veil',
    name: 'Circular Khimar Veil',
    slug: 'circular-khimar-veil',
    description:
      'Experience effortless modesty with the Circular Khimar Veil by Black Modesty. Designed using our exclusive premium fabric, it provides full coverage, feels incredibly lightweight, and drapes beautifully for all-day comfort. Its circular cut offers excellent coverage over the shoulders and upper body while remaining easy to wear — ideal for everyday use, prayer, Umrah, Hajj, and daily outings.\n\nAvailable sizes: 1.25 m, 1.5 m, and custom sizes upon request.\nAvailable styles: Plain Edge, Narrow Satin Trim, Wide Satin Trim, Ruffle Edge.',
    highlight: 'Lightweight circular khimar veil with full shoulder coverage.',
    category: 'women',
    gender: 'women',
    price: 22.12,
    sizes: ['125cm', '150cm', '125cm + Elastic', '150cm + Elastic'],
    colors: ['Black'],
    colorImages: {
      Black: imageSet('circular-khimar-veil', 'black'),
    },
    tags: ['women', 'khimar', 'veil', 'chiffon', 'modest', 'black-modesty'],
    badge: 'Black Modesty',
    imageUrl: '/women/circular-khimar-veil/black/main.jpg',
  },
  {
    id: 'women-black-modesty-circular-khimar-satin',
    name: 'Circular Khimar "Ghashwa" — with Satin',
    slug: 'circular-khimar-satin',
    description:
      'A modest circular khimar adorned with a soft satin ribbon that adds a quiet, elegant touch without drawing attention. Made from lightweight, soft chiffon fabric — offering all-day comfort and full coverage. You can also choose your preferred option with or without an elastic headband for the most comfortable fit.\n\nComplete coverage, insha\'Allah… with a style that reflects your identity. Most Black Modesty products are made to order, allowing us to customize details and measurements to suit your needs whenever possible.',
    highlight: 'Circular khimar finished with a soft satin ribbon.',
    category: 'women',
    gender: 'women',
    price: 27.88,
    sizes: ['125cm', '150cm', '125cm + Elastic', '150cm + Elastic'],
    colors: ['Black'],
    colorImages: {
      Black: imageSet('circular-khimar-satin', 'black'),
    },
    tags: ['women', 'khimar', 'ghashwa', 'satin', 'chiffon', 'modest', 'black-modesty'],
    badge: 'Black Modesty',
    imageUrl: '/women/circular-khimar-satin/black/main.jpg',
  },
  {
    id: 'women-black-modesty-niqab-lathama',
    name: 'Niqab Lathama — Egyptian / Malaysian Style',
    slug: 'niqab-lathama',
    description:
      'Whether you call it Lathama, Egyptian, or Malaysian style, this niqab is designed to offer the perfect balance of comfort, practicality, and full modest coverage. Made from our exclusive premium chiffon fabric, it features a deep, rich black shade and a lightweight feel for comfortable everyday wear.\n\nFeatures:\n* Lightweight, premium-quality chiffon with a deep black color\n* Available in multiple sizes to suit different face shapes\n* Elastic band with adjustable straps for a comfortable, secure fit\n* Adjustable width for greater control over the fit\n* Practical, simple design suitable for everyday wear\n\nMeasurements (approximate): 20 cm (XS), 25 cm (S), 30 cm (M), 35 cm (L).',
    highlight: 'Premium chiffon niqab with adjustable straps and elastic band.',
    category: 'women',
    gender: 'women',
    price: 7.69,
    sizes: ['20cm (XS)', '25cm (S)', '30cm (M)', '35cm (L)'],
    colors: ['Black'],
    colorImages: {
      Black: imageSet('niqab-lathama', 'black'),
    },
    tags: ['women', 'niqab', 'lathama', 'chiffon', 'modest', 'black-modesty'],
    badge: 'Black Modesty',
    imageUrl: '/women/niqab-lathama/black/main.jpg',
  },
  {
    id: 'women-black-modesty-crepe-abaya-zipper-pleats',
    name: 'Crepe Abaya with Zipper & Back Pleats',
    slug: 'crepe-abaya-zipper-pleats',
    description:
      'A thoughtfully designed abaya for women who seek true comfort without compromising modesty or style.\n\n* Soft, high-quality crepe fabric\n* Classic shirt-style cut\n* Hand-pleated back for extra room and graceful flow\n* Front zipper for easy wear\n* Sleeve zippers for easy ablution\n* Hidden side pockets for privacy\n\nPerfect for daily errands, university, or work — a piece that keeps you confident, covered, and comfortable wherever you go. A must-have for every modest wardrobe.',
    highlight: 'Crepe abaya with front zipper, sleeve zippers and hand-pleated back.',
    category: 'women',
    gender: 'women',
    price: 57.50,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    colorImages: {
      Black: imageSet('crepe-abaya-zipper-pleats', 'black', 2),
    },
    tags: ['women', 'abaya', 'crepe', 'modest', 'black-modesty'],
    badge: 'Black Modesty',
    imageUrl: '/women/crepe-abaya-zipper-pleats/black/main.jpg?v=2',
  },
];
