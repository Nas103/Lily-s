export type ProductCategory = 'men' | 'women' | 'perfumes' | 'abaya';

// Backend returns category as object with name and slug
export type ProductCategoryObject = {
  name: string;
  slug: string;
};

// Helper function to get category name from any format
export function getCategoryName(category: ProductCategory | ProductCategoryObject | string | undefined): string {
  if (!category) return 'PRODUCT';
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && category !== null) {
    return (category as ProductCategoryObject).name || (category as ProductCategoryObject).slug || 'PRODUCT';
  }
  return 'PRODUCT';
}

// Product image angles for each color
export type ProductImageAngle = 'front' | 'back' | 'side' | 'top';

// Color-specific images with 4 angles per color
export type ColorImageSet = {
  front: string;  // Front view image URL
  back: string;   // Back view image URL
  side: string;   // Side view image URL
  top: string;    // Top view image URL
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  highlight?: string;
  category: ProductCategory | ProductCategoryObject | string; // Support both formats
  subCategory?: string; // Sub-category (e.g., 'clothing', 'equipment' for BoxRaw)
  gender?: 'men' | 'women' | 'unisex';
  price: number;
  tags?: string[];
  badge?: string;
  imageUrl: string; // Default/main image
  sizes?: string[];
  colors?: string[];
  // Multiple images per color with 4 angles (front, back, side, top)
  colorImages?: Record<string, ColorImageSet>;
  // Legacy support for old format
  colorImagesLegacy?: Record<string, string[]>;
  convertedPrice?: number;
  currency?: string;
  currencySymbol?: string;
  discountPercent?: number; // Discount percentage (e.g., 20 for 20% off)
};

export type DeliveryAddress = {
  id: string;
  label: string;
  fullName: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  isDefault: boolean;
};

export type PaymentMethod = {
  id: string;
  type: 'CARD' | 'BANK_ACCOUNT' | 'E_WALLET';
  cardLast4?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  holderName?: string;
  isDefault: boolean;
};

export type Order = {
  id: string;
  orderNumber: string; // Unique order number for tracking
  total: number;
  createdAt: string;
  orderItems: OrderItem[];
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
};

export type OrderItem = {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
};

