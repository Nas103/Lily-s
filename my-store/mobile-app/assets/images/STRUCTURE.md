# Image Folder Structure Quick Reference

## 📂 Complete Folder Structure

```
assets/images/
│
├── themes/                          # Home page slideshow images
│   ├── modern-abaya/               # 10 images (image-01.jpg to image-10.jpg)
│   ├── signature-perfumes/         # 10 images
│   ├── lifestyle/                  # 9 images
│   ├── running/                    # 9 images
│   ├── boxraw/                     # 10 images
│   └── electronics/                # 10 images
│
└── products/                        # Product images
    │
    ├── lifestyle/                  # 15 products
    │   ├── product-001/
    │   │   ├── main.jpg
    │   │   └── color-images/
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
    │   ├── product-002/
    │   └── ... (up to product-015)
    │
    ├── running/
    │   ├── men/                    # 10 products
    │   │   ├── product-001/
    │   │   └── ... (up to product-010)
    │   └── women/                  # 10 products
    │       ├── product-001/
    │       └── ... (up to product-010)
    │
    ├── boxraw/
    │   ├── clothing/                # 20 products
    │   │   ├── product-001/
    │   │   └── ... (up to product-020)
    │   └── equipment/              # 10 products
    │       ├── product-001/
    │       └── ... (up to product-010)
    │
    ├── electronics/
    │   ├── apple/                  # 10 products
    │   │   ├── product-001/
    │   │   └── ... (up to product-010)
    │   ├── samsung/                # 10 products
    │   │   ├── product-001/
    │   │   └── ... (up to product-010)
    │   └── flagship/               # 15 products
    │       ├── product-001/
    │       └── ... (up to product-015)
    │
    ├── perfumes/
    │   ├── men/                    # 15 products
    │   │   ├── product-001/
    │   │   └── ... (up to product-015)
    │   └── women/                  # 15 products
    │       ├── product-001/
    │       └── ... (up to product-015)
    │
    └── abaya/                      # Variable number of products
        ├── product-001/
        └── ...
```

## 📋 Product ID to Folder Mapping

| Product ID Pattern | Folder Path |
|-------------------|-------------|
| `lifestyle-001` | `products/lifestyle/product-001/` |
| `running-men-001` | `products/running/men/product-001/` |
| `running-women-001` | `products/running/women/product-001/` |
| `boxraw-clothing-001` | `products/boxraw/clothing/product-001/` |
| `boxraw-equipment-001` | `products/boxraw/equipment/product-001/` |
| `electronics-apple-001` | `products/electronics/apple/product-001/` |
| `electronics-samsung-001` | `products/electronics/samsung/product-001/` |
| `electronics-flagship-001` | `products/electronics/flagship/product-001/` |
| `perfume-men-001` | `products/perfumes/men/product-001/` |
| `perfume-women-001` | `products/perfumes/women/product-001/` |

## 🎨 Color Folder Names

Use lowercase color names for folders:
- `black/`
- `white/`
- `navy/`
- `grey/` or `gray/`
- `red/`
- `clear/`
- `blue/`
- `green/`
- etc.

**Important**: Color folder names must match the color names in your product data (case-insensitive matching recommended).

## 📸 Image File Naming

### Theme Images
- `image-01.jpg`, `image-02.jpg`, ... `image-10.jpg`
- Or: `01.jpg`, `02.jpg`, ... `10.jpg`

### Product Images
- Main image: `main.jpg` (or `main.png`)
- Color angles: `front.jpg`, `back.jpg`, `side.jpg`, `top.jpg`

## 🔢 Product Counts

- **LifeStyle**: 15 products
- **Running Men**: 10 products
- **Running Women**: 10 products
- **BoxRaw Clothing**: 20 products
- **BoxRaw Equipment**: 10 products
- **Electronics Apple**: 10 products
- **Electronics Samsung**: 10 products
- **Electronics Flagship**: 15 products
- **Perfumes Men**: 15 products
- **Perfumes Women**: 15 products

## 💡 Tips

1. **Create folders as you go**: You don't need to create all folders upfront. Create them when you upload images for each product.

2. **Use consistent naming**: Stick to one naming convention (e.g., always use `product-001` not `product-1` or `product_001`).

3. **Image formats**: Use `.jpg` for photos, `.png` for images with transparency. Both work in React Native.

4. **Missing images**: If a product doesn't have all color angles, you can duplicate the main image or use a placeholder.

5. **Single color products**: For products with only one color, you can skip the `color-images` folder and just use `main.jpg`.

