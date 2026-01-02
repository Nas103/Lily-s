# Product Specifications

## Perfumes Page
- **Men's Section**: 15 products
- **Women's Section**: 15 products
- Each product has: 1 image (TODO: Replace with actual perfume product images)
- Full functionality: Add to cart, wishlist, currency conversion, product detail view

## LifeStyle Category (Shoes)
- **Total Products**: 15 products (e.g., Nike LeBron TR1)
- **Sizes**: 6, 7, 8, 9, 10, 11 (6 sizes total)
- **Images per product**: 
  - 1 main image
  - 4 extra side images per color (front, back, side, top)
- **Colors**: 
  - 10 products have maximum 3 colors each
  - 5 products have 2 colors each
  - Each color has full colorImages structure with front, back, side, top angles
- **Full functionality**: Add to cart, wishlist, size selection, color selection, currency conversion
- **Sample data file**: `src/data/lifestyleProducts.ts` - Contains all 15 products with TODO comments for image replacement

## Running Category (Shoes)
- **Total Products**: 20 products (10 for men, 10 for women)
- **Layout**: Grid format with MEN section first, then WOMEN section
- **Sizes**: 6, 7, 8, 9, 10, 11 (6 sizes total)
- **Men's Products**: 10 products with various color options
- **Women's Products**: 
  - 5 products have 3 colors max with full colorImages structure (front, back, side, top)
  - 5 products have 1 color but with different side images (front, back, side, top)
- **Images per product**: 
  - 1 main image
  - 4 extra side images per color (front, back, side, top)
- **Full functionality**: Add to cart, wishlist, size selection, color selection, currency conversion
- **Sample data file**: `src/data/runningProducts.ts` - Contains all 20 products with TODO comments for image replacement

## BoxRaw Category
- **Sub-categories**: Clothing and Equipment
- **Sub-category filter**: Toggle between Clothing and Equipment when BoxRaw category is selected

### BoxRaw Clothing Sub-category
- **Total Products**: 20 products
- **Product Types**:
  - Training Shorts
  - Training Jacket
  - Tracksuit
  - Training T-Shirt
  - Sparring Club Label Shorts
  - Bivol x BoxRaw: Shorts, T-shirts, Tracksuit, Trainers
  - Competition Shorts
  - Hooded Jacket
  - Training Pants
  - Tank Top
  - Long Sleeve T-Shirt
  - Compression Shorts
  - Training Vest
  - Sweatpants
  - Polo Shirt
  - Windbreaker
  - Training Shorts Pro
- **Sizes**: S, M, L, XL (up to XL only, no XXL or larger)
- **Colors**:
  - 5 products have 2 colors (1 image per color)
  - 15 products have 1 color only (1 image per color)
- **Images per product**: 
  - 1 image per color (no side images needed)
  - All angles use the same image (front, back, side, top all point to same image)
- **Full functionality**: Add to cart, wishlist, size selection, color selection, currency conversion
- **Sample data file**: `src/data/boxrawProducts.ts` - Contains all 20 clothing products with TODO comments for image replacement

### BoxRaw Equipment Sub-category
- **Total Products**: 10 products
- **Product Types**:
  - Boxing Hand Wraps
  - Knuckle Protector
  - Boxing Gloves
  - Mouthguard
  - Headgear
  - Shin Guards
  - Groin Protector
  - Jump Rope
  - Focus Pads
  - Punching Bag Gloves
- **Colors**: Each product has 1 color only
- **Images**: 1 image per product (no side images needed)
- **Sizes**: No sizes needed for equipment
- **Full functionality**: Add to cart, wishlist, currency conversion
- **Sample data file**: `src/data/boxrawProducts.ts` - Contains all 10 equipment products with TODO comments for image replacement

## Electronics Category
- **Sub-categories**: Apple, Samsung, Flagship
- **Sub-category filter**: Toggle between Apple, Samsung, and Flagship when Electronics category is selected

### Apple Sub-category
- **Total Products**: 10 products
- **Product Examples**:
  - iPhone 17 Pro Max
  - iPhone 17 Pro
  - iPhone 17
  - iPad Pro 13-inch
  - MacBook Pro 16-inch
  - AirPods Pro 3
  - Apple Watch Ultra 3
  - Mac Studio
  - Apple Vision Pro
  - iPad Air 13-inch
- **Colors**: Each product has maximum 3 colors
- **Images per color**: 3 images (front, back, side) - no top view
- **Full functionality**: Add to cart, wishlist, color selection, currency conversion
- **Note**: No size selection needed for electronics
- **Sample data file**: `src/data/electronicsProducts.ts` - Contains all 10 Apple products with TODO comments for image replacement

### Samsung Sub-category
- **Total Products**: 10 products
- **Product Examples**:
  - Samsung Galaxy S25 Ultra
  - Samsung Galaxy S25+
  - Samsung Galaxy S25
  - Samsung Galaxy Z Fold 6
  - Samsung Galaxy Z Flip 6
  - Samsung Galaxy Tab S10 Ultra
  - Samsung Galaxy Watch 7 Pro
  - Samsung Galaxy Buds3 Pro
  - Samsung Galaxy Book4 Ultra
  - Samsung Galaxy A55 5G
- **Colors**: Each product has 3 colors
- **Images per color**: 3 images (front, back, side) - no top view
- **Full functionality**: Add to cart, wishlist, color selection, currency conversion
- **Note**: No size selection needed for electronics
- **Sample data file**: `src/data/electronicsProducts.ts` - Contains all 10 Samsung products with TODO comments for image replacement

### Flagship Sub-category
- **Total Products**: 15 products
- **Product Examples**:
  - Red Magic 11 Pro
  - OnePlus 13 Pro
  - Xiaomi 15 Ultra
  - Google Pixel 10 Pro
  - Oppo Find X8 Pro
  - Vivo X200 Pro
  - Honor Magic 7 Pro
  - Realme GT 7 Pro
  - Motorola Edge 50 Ultra
  - Nothing Phone 3 Pro
  - ASUS ROG Phone 9
  - Sony Xperia 1 VI
  - Tecno Phantom X2 Pro
  - Infinix Zero Ultra 5G
  - POCO F7 Pro
- **Colors**: Each product has maximum 2 colors
- **Images per color**: 3 images (front, back, side) - no top view
- **Full functionality**: Add to cart, wishlist, color selection, currency conversion
- **Note**: No size selection needed for electronics
- **Sample data file**: `src/data/electronicsProducts.ts` - Contains all 15 Flagship products with TODO comments for image replacement

## Image Placeholders
All category slideshow images have TODO comments for replacement:
- `MODERN_ABAYA_IMAGES` - TODO: Replace with actual abaya images
- `SIGNATURE_PERFUMES_IMAGES` - TODO: Replace with actual perfume images
- `LIFESTYLE_IMAGES` - TODO: Replace with actual lifestyle shoe images
- `RUNNING_IMAGES` - TODO: Replace with actual running shoe images
- `BOXRAW_IMAGES` - TODO: Replace with actual boxraw clothing images
- `ELECTRONICS_IMAGES` - TODO: Replace with actual electronics images

## Backend Requirements
The backend API should support these categories:
- `lifestyle` - LifeStyle shoes
- `running` - Running shoes
- `boxraw` - BoxRaw clothing
- `boxraw-equipment` - BoxRaw equipment (sub-category)
- `electronics` - Electronics
  - `electronics-apple` - Apple products (sub-category)
  - `electronics-samsung` - Samsung products (sub-category)
  - `electronics-flagship` - Flagship products (sub-category)

Products should include:
- `sizes` array (for shoes and clothing)
- `colors` array (max 2-3 for specified categories)
- `colorImages` object with image URLs per color
- `category` field matching the category name
- `subCategory` field for BoxRaw products ('clothing' or 'equipment')
- `gender` field for perfumes and running shoes ('men' or 'women')

