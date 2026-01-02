# Image Assets Structure

This directory contains all image assets for the mobile app, organized by category and product type.

## 📁 Folder Structure

```
assets/images/
├── themes/                    # Theme/slideshow images for home page categories
│   ├── modern-abaya/         # Modern Abaya slideshow images (10 images)
│   ├── signature-perfumes/   # Signature Perfumes slideshow images (10 images)
│   ├── lifestyle/            # LifeStyle slideshow images (9 images)
│   ├── running/              # Running slideshow images (9 images)
│   ├── boxraw/               # BoxRaw slideshow images (10 images)
│   └── electronics/          # Electronics slideshow images (10 images)
│
└── products/                 # Product images organized by category
    ├── lifestyle/            # LifeStyle shoe products
    │   ├── product-001/      # Individual product folders
    │   │   ├── main.jpg      # Main product image
    │   │   └── color-images/ # Color variant images
    │   │       ├── black/
    │   │       │   ├── front.jpg
    │   │       │   ├── back.jpg
    │   │       │   ├── side.jpg
    │   │       │   └── top.jpg
    │   │       └── white/
    │   │           ├── front.jpg
    │   │           ├── back.jpg
    │   │           ├── side.jpg
    │   │           └── top.jpg
    │   └── product-002/
    │       └── ...
    │
    ├── running/               # Running shoe products
    │   ├── men/              # Men's running shoes
    │   │   └── product-XXX/
    │   └── women/            # Women's running shoes
    │       └── product-XXX/
    │
    ├── boxraw/               # BoxRaw products
    │   ├── clothing/         # BoxRaw clothing products
    │   │   └── product-XXX/
    │   └── equipment/        # BoxRaw equipment products
    │       └── product-XXX/
    │
    ├── electronics/          # Electronics products
    │   ├── apple/            # Apple products
    │   │   └── product-XXX/
    │   ├── samsung/          # Samsung products
    │   │   └── product-XXX/
    │   └── flagship/         # Flagship products
    │       └── product-XXX/
    │
    ├── perfumes/             # Perfume products
    │   ├── men/              # Men's perfumes
    │   │   └── product-XXX/
    │   └── women/            # Women's perfumes
    │       └── product-XXX/
    │
    └── abaya/                # Abaya products
        └── product-XXX/
```

## 📝 How to Replace URLs with Local Storage Paths

### Step 1: Upload Your Images

1. **Theme Images**: Upload slideshow images to their respective folders:
   - `assets/images/themes/modern-abaya/` → Name them `image-01.jpg`, `image-02.jpg`, etc.
   - `assets/images/themes/signature-perfumes/` → Name them `image-01.jpg`, `image-02.jpg`, etc.
   - `assets/images/themes/lifestyle/` → Name them `image-01.jpg`, `image-02.jpg`, etc.
   - `assets/images/themes/running/` → Name them `image-01.jpg`, `image-02.jpg`, etc.
   - `assets/images/themes/boxraw/` → Name them `image-01.jpg`, `image-02.jpg`, etc.
   - `assets/images/themes/electronics/` → Name them `image-01.jpg`, `image-02.jpg`, etc.

2. **Product Images**: Upload product images following this structure:
   - Main product image: `assets/images/products/{category}/product-XXX/main.jpg`
   - Color images: `assets/images/products/{category}/product-XXX/color-images/{color-name}/{angle}.jpg`
     - Angles: `front.jpg`, `back.jpg`, `side.jpg`, `top.jpg` (or `front.png`, etc.)

### Step 2: Update Theme Image Arrays

**File**: `app/(tabs)/index.tsx`

Replace the image URL arrays with local require statements:

```typescript
// Before (URLs):
const MODERN_ABAYA_IMAGES = [
  'https://images.unsplash.com/photo-...',
  'https://images.unsplash.com/photo-...',
];

// After (Local paths):
const MODERN_ABAYA_IMAGES = [
  require('../../assets/images/themes/modern-abaya/image-01.jpg'),
  require('../../assets/images/themes/modern-abaya/image-02.jpg'),
  require('../../assets/images/themes/modern-abaya/image-03.jpg'),
  // ... continue for all 10 images
];
```

**Repeat for all theme arrays:**
- `MODERN_ABAYA_IMAGES`
- `SIGNATURE_PERFUMES_IMAGES`
- `LIFESTYLE_IMAGES`
- `RUNNING_IMAGES`
- `BOXRAW_IMAGES`
- `ELECTRONICS_IMAGES`

### Step 3: Update Product Data Files

**Files to update:**
- `src/data/lifestyleProducts.ts`
- `src/data/runningProducts.ts`
- `src/data/boxrawProducts.ts`
- `src/data/electronicsProducts.ts`
- `app/perfumes.tsx` (if it has product data)

**Example for Lifestyle Products:**

```typescript
// Before (URLs):
{
  id: 'lifestyle-001',
  name: 'Nike LeBron TR1',
  imageUrl: 'https://static.nike.com/a/images/...',
  colorImages: {
    'Black': {
      front: 'https://static.nike.com/a/images/...',
      back: 'https://static.nike.com/a/images/...',
      side: 'https://static.nike.com/a/images/...',
      top: 'https://static.nike.com/a/images/...',
    },
  },
}

// After (Local paths):
{
  id: 'lifestyle-001',
  name: 'Nike LeBron TR1',
  imageUrl: require('../../assets/images/products/lifestyle/product-001/main.jpg'),
  colorImages: {
    'Black': {
      front: require('../../assets/images/products/lifestyle/product-001/color-images/black/front.jpg'),
      back: require('../../assets/images/products/lifestyle/product-001/color-images/black/back.jpg'),
      side: require('../../assets/images/products/lifestyle/product-001/color-images/black/side.jpg'),
      top: require('../../assets/images/products/lifestyle/product-001/color-images/black/top.jpg'),
    },
  },
}
```

**For Running Products (Men/Women):**

```typescript
// Men's products:
imageUrl: require('../../assets/images/products/running/men/product-XXX/main.jpg'),

// Women's products:
imageUrl: require('../../assets/images/products/running/women/product-XXX/main.jpg'),
```

**For BoxRaw Products:**

```typescript
// Clothing:
imageUrl: require('../../assets/images/products/boxraw/clothing/product-XXX/main.jpg'),

// Equipment:
imageUrl: require('../../assets/images/products/boxraw/equipment/product-XXX/main.jpg'),
```

**For Electronics Products:**

```typescript
// Apple:
imageUrl: require('../../assets/images/products/electronics/apple/product-XXX/main.jpg'),

// Samsung:
imageUrl: require('../../assets/images/products/electronics/samsung/product-XXX/main.jpg'),

// Flagship:
imageUrl: require('../../assets/images/products/electronics/flagship/product-XXX/main.jpg'),
```

**For Perfumes:**

```typescript
// Men's:
imageUrl: require('../../assets/images/products/perfumes/men/product-XXX/main.jpg'),

// Women's:
imageUrl: require('../../assets/images/products/perfumes/women/product-XXX/main.jpg'),
```

### Step 4: Update ImageSlideshow Component (if needed)

The `ImageSlideshow` component should work with both URLs and local require statements. However, if you encounter issues, you may need to update `src/components/ImageSlideshow.tsx` to handle both cases:

```typescript
// In ImageSlideshow.tsx, the Image component should handle both:
<Image
  source={
    typeof images[currentIndex] === 'string'
      ? { uri: images[currentIndex] }  // URL
      : images[currentIndex]            // Local require
  }
  style={styles.image}
  resizeMode="cover"
/>
```

### Step 5: Product Image Naming Convention

For easier management, use this naming convention:

**Product IDs Mapping:**
- Lifestyle: `lifestyle-001` → `product-001`
- Running Men: `running-men-001` → `men/product-001`
- Running Women: `running-women-001` → `women/product-001`
- BoxRaw Clothing: `boxraw-clothing-001` → `clothing/product-001`
- BoxRaw Equipment: `boxraw-equipment-001` → `equipment/product-001`
- Electronics Apple: `electronics-apple-001` → `apple/product-001`
- Electronics Samsung: `electronics-samsung-001` → `samsung/product-001`
- Electronics Flagship: `electronics-flagship-001` → `flagship/product-001`
- Perfumes Men: `perfume-men-001` → `men/product-001`
- Perfumes Women: `perfume-women-001` → `women/product-001`

### Step 6: Color Image Structure

For products with multiple colors, organize images like this:

```
product-001/
├── main.jpg                    # Default/main product image
└── color-images/
    ├── black/
    │   ├── front.jpg
    │   ├── back.jpg
    │   ├── side.jpg
    │   └── top.jpg
    ├── white/
    │   ├── front.jpg
    │   ├── back.jpg
    │   ├── side.jpg
    │   └── top.jpg
    └── navy/
        ├── front.jpg
        ├── back.jpg
        ├── side.jpg
        └── top.jpg
```

**Note**: For products with only one image per color (like BoxRaw clothing), you can use the same image for all angles:
- `front.jpg` = `back.jpg` = `side.jpg` = `top.jpg`

### Step 7: Image Formats

Supported formats:
- `.jpg` / `.jpeg`
- `.png`
- `.webp` (if supported by React Native version)

**Recommendation**: Use `.jpg` for photos and `.png` for images with transparency.

### Step 8: Testing

After replacing URLs with local paths:

1. **Clear cache**: 
   ```bash
   npx expo start -c
   ```

2. **Test each category**: Navigate through all categories and verify images load correctly

3. **Test product details**: Open product detail pages and verify all color images and angles display properly

4. **Test slideshows**: Verify all theme slideshows transition smoothly

## 📊 Product Count Reference

Use this as a reference when organizing your images:

- **LifeStyle**: 15 products
- **Running**: 20 products (10 men, 10 women)
- **BoxRaw Clothing**: 20 products
- **BoxRaw Equipment**: 10 products
- **Electronics Apple**: 10 products
- **Electronics Samsung**: 10 products
- **Electronics Flagship**: 15 products
- **Perfumes Men**: 15 products
- **Perfumes Women**: 15 products
- **Abaya**: Variable (check your data)

## ⚠️ Important Notes

1. **File Size**: Keep images optimized. Recommended max size:
   - Theme images: 1920x1080px or smaller
   - Product main images: 800x800px or smaller
   - Color angle images: 800x800px or smaller

2. **Naming**: Use lowercase, hyphens, and numbers only. Avoid spaces and special characters.

3. **Case Sensitivity**: Color names in folder paths must match exactly with color names in product data (e.g., "Black" in code → "black" folder).

4. **Missing Images**: If an image is missing, the app may crash. Always ensure all referenced images exist.

5. **Performance**: Local images load faster than URLs but increase app bundle size. Consider using remote images for production if bundle size is a concern.

## 🔄 Quick Reference: File Locations

| Category | Theme Images | Product Images |
|----------|-------------|----------------|
| Modern Abaya | `themes/modern-abaya/` | `products/abaya/` |
| Signature Perfumes | `themes/signature-perfumes/` | `products/perfumes/{men\|women}/` |
| LifeStyle | `themes/lifestyle/` | `products/lifestyle/` |
| Running | `themes/running/` | `products/running/{men\|women}/` |
| BoxRaw | `themes/boxraw/` | `products/boxraw/{clothing\|equipment}/` |
| Electronics | `themes/electronics/` | `products/electronics/{apple\|samsung\|flagship}/` |

## 📞 Need Help?

If you encounter issues:
1. Check that all image paths are correct
2. Verify image file names match exactly (case-sensitive)
3. Ensure all required images exist
4. Clear Expo cache and restart the development server

