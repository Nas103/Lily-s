# 🚀 Quick Start: Uploading Images

## Step 1: Upload Theme Images

Upload slideshow images to these folders:

```
assets/images/themes/
├── modern-abaya/        → Upload 10 images (image-01.jpg to image-10.jpg)
├── signature-perfumes/  → Upload 10 images
├── lifestyle/           → Upload 9 images
├── running/             → Upload 9 images
├── boxraw/              → Upload 10 images
└── electronics/         → Upload 10 images
```

## Step 2: Upload Product Images

For each product, create a folder and upload images:

### Example: LifeStyle Product (lifestyle-001)

1. Create folder: `assets/images/products/lifestyle/product-001/`
2. Upload main image: `main.jpg`
3. Create color folders: `color-images/black/`, `color-images/white/`, etc.
4. Upload angle images for each color:
   - `front.jpg`
   - `back.jpg`
   - `side.jpg`
   - `top.jpg`

### Example: Running Product (running-men-001)

1. Create folder: `assets/images/products/running/men/product-001/`
2. Upload main image: `main.jpg`
3. Upload color images as above

### Example: BoxRaw Clothing (boxraw-clothing-001)

1. Create folder: `assets/images/products/boxraw/clothing/product-001/`
2. Upload main image: `main.jpg`
3. For single-image products, you can use the same image for all angles

## Step 3: Update Code

After uploading images, follow the instructions in `README.md` to replace URLs with local paths.

## 📝 Example Code Change

**Before (URL):**
```typescript
imageUrl: 'https://static.nike.com/a/images/...'
```

**After (Local):**
```typescript
imageUrl: require('../../assets/images/products/lifestyle/product-001/main.jpg')
```

## ⚡ Quick Tips

- **Naming**: Use `product-001`, `product-002`, etc. (with leading zeros)
- **Formats**: `.jpg` or `.png` both work
- **Colors**: Use lowercase folder names (`black/`, not `Black/`)
- **Missing images**: You can duplicate the main image for missing angles

## 📚 Full Documentation

See `README.md` for complete instructions and examples.

